function v7rcDefinitions() {
  Blockly.Python.definitions_['from_machine_import_uart_pin'] = 'from machine import UART, Pin';
  Blockly.Python.definitions_['from_time_import_ticks'] = 'from time import ticks_ms, ticks_diff';

  Blockly.Python.definitions_['v7rc_class'] = `
class V7RC:
    PACKET_LENGTH = 20
    LOST_SIGNAL_MAX_TIME = 500

    def __init__(self):
        self.uart = None
        self.buffer = bytearray()
        self.last_time = ticks_ms()
        self.lostSignal = True

        self.commandData = ""
        self.commandCode = ""  # Compatibility alias
        self.rawData = ""
        self.rawPacket = ""    # Compatibility alias
        self.rawBytes = [0] * 16
        self.payloadBytes = [0] * 16
        self.channels = [1500] * 16
        self.channelPercents = [50] * 16
        self.channelSignedPercents = [0] * 16
        self.degrees = [0] * 16
        self.cmdText = ""
        self.ledGroup = -1

    def begin(self, uart_id=1, rx_pin=5, baudrate=115200):
        try:
            self.uart = UART(int(uart_id), baudrate=int(baudrate), rx=Pin(int(rx_pin)))
        except TypeError:
            # Some MicroPython ports require TX even if V7RC is receive-only.
            self.uart = UART(int(uart_id), baudrate=int(baudrate), rx=Pin(int(rx_pin)), tx=Pin(int(rx_pin) + 1))
        self.buffer = bytearray()
        self.last_time = ticks_ms()
        self.lostSignal = True

    def _constrain(self, value, low, high):
        value = int(value)
        if value < low:
            return low
        if value > high:
            return high
        return value

    def pwm_to_percent(self, pwm_us):
        # Convert standard PWM-style range 1000-2000 us to 0-100%.
        # 1000 = 0%, 1500 = 50%, 2000 = 100%.
        pwm_us = self._constrain(pwm_us, 1000, 2000)
        return int((pwm_us - 1000) * 100 / 1000)

    def pwm_to_signed_percent(self, pwm_us):
        # Convert standard PWM-style range 1000-2000 us to signed percent.
        # 1000 = -100, 1500 = 0, 2000 = 100.
        # This matches the orange value shown in the V7RC UI.
        pwm_us = self._constrain(pwm_us, 1000, 2000)
        return int((pwm_us - 1500) * 100 / 500)

    def channelPercent(self, channel):
        channel = self._constrain(channel, 0, 15)
        return self.pwm_to_percent(self.channels[channel])

    def channelSignedPercent(self, channel):
        channel = self._constrain(channel, 0, 15)
        return self.pwm_to_signed_percent(self.channels[channel])

    def _decode_ascii(self, data):
        try:
            return data.decode()
        except Exception:
            # Keep binary frame readable for display/debug.
            out = ""
            for b in data:
                if 32 <= b <= 126:
                    out += chr(b)
                else:
                    out += chr(92) + "x%02X" % b
            return out

    def _set_payload(self, payload):
        for i in range(16):
            self.payloadBytes[i] = payload[i] if i < len(payload) else 0

    def _refresh_percents(self):
        for i in range(16):
            self.channelPercents[i] = self.pwm_to_percent(self.channels[i])
            self.channelSignedPercents[i] = self.pwm_to_signed_percent(self.channels[i])

    def _set_raw_channels(self, values):
        # For HEX and SS8: read PWM us = raw byte * 10.
        for i in range(16):
            raw = values[i] if i < len(values) else 150
            self.rawBytes[i] = raw
            self.channels[i] = raw * 10
        self._refresh_percents()

    def _set_degrees(self, values):
        # For DEG: degree = raw byte - 127.
        for i in range(16):
            raw = values[i] if i < len(values) else 127
            self.rawBytes[i] = raw
            self.degrees[i] = raw - 127

    def _parse_4_pwm_values(self, text, offset):
        values = []
        for i in range(4):
            start = offset + i * 4
            end = start + 4
            values.append(int(text[start:end]))
        return values

    def _set_command_data(self, code):
        self.commandData = code
        self.commandCode = code

    def _set_raw_data(self, frame):
        decoded = self._decode_ascii(frame)
        self.rawData = decoded
        self.rawPacket = decoded

    def _parse_packet(self, frame):
        if len(frame) < 4 or frame[-1] != ord("#"):
            return False

        code = self._decode_ascii(frame[0:3])
        payload = frame[3:-1]

        self._set_command_data(code)
        self._set_raw_data(frame)
        self._set_payload(payload)

        try:
            if code == "SRV" or code == "SRT":
                # SRV/SRT + 4 decimal PWM-style fields + #
                # Example: SRV1500150015001500#
                text = self._decode_ascii(frame)
                values = self._parse_4_pwm_values(text, 3)
                for i, pwm in enumerate(values):
                    self.channels[i] = pwm
                    self.rawBytes[i] = int(pwm / 10)
                self._refresh_percents()

            elif code == "SR2":
                # Second PWM group C5-C8 => channel 4..7
                text = self._decode_ascii(frame)
                values = self._parse_4_pwm_values(text, 3)
                for i, pwm in enumerate(values):
                    ch = i + 4
                    self.channels[ch] = pwm
                    self.rawBytes[ch] = int(pwm / 10)
                self._refresh_percents()

            elif code == "SS8":
                # SS8 + 8 hex bytes + optional padding + #
                # Example: SS896969696969696# => 0x96 = 150 => 1500 us => 50%
                text = self._decode_ascii(frame)
                hex_text = text[3:-1].strip()
                values = []
                for i in range(0, min(len(hex_text), 16), 2):
                    values.append(int(hex_text[i:i + 2], 16))
                self._set_raw_channels(values)

            elif code == "HEX":
                # HEX + 16 raw bytes + #
                # read PWM us = raw byte * 10
                values = list(payload[:16])
                self._set_raw_channels(values)

            elif code == "DEG":
                # DEG + 16 raw bytes + #
                # degree = raw byte - 127
                values = list(payload[:16])
                self._set_degrees(values)

            elif code == "CMD":
                # CMD + up to 16 chars padded by spaces + #
                self.cmdText = self._decode_ascii(payload).rstrip()

            elif code == "LED" or (len(code) == 3 and code[0:2] == "LE"):
                # LED / LE2 / LE? group. Payload is 16 RGBM nibbles/bytes.
                if code == "LED":
                    self.ledGroup = 1
                else:
                    try:
                        self.ledGroup = int(code[2])
                    except Exception:
                        self.ledGroup = -1

            else:
                return False

        except Exception:
            return False

        self.last_time = ticks_ms()
        self.lostSignal = False
        return True

    def update(self):
        parsed = False

        if self.uart is None:
            return False

        n = self.uart.any()
        if n:
            data = self.uart.read(n)
            if data:
                self.buffer.extend(data)

        # Main format is 20 bytes. Parse fixed 20-byte frames first.
        while len(self.buffer) >= self.PACKET_LENGTH:
            if self.buffer[self.PACKET_LENGTH - 1] == ord("#"):
                frame = bytes(self.buffer[:self.PACKET_LENGTH])
                self.buffer = bytearray(self.buffer[self.PACKET_LENGTH:])
                if self._parse_packet(frame):
                    parsed = True
            else:
                # Re-sync packet boundary.
                self.buffer = bytearray(self.buffer[1:])

        # Optional support for shorter packets ending with # and length <= 20.
        hash_index = -1
        for i, b in enumerate(self.buffer):
            if b == ord("#"):
                hash_index = i
                break

        if hash_index >= 0 and hash_index < self.PACKET_LENGTH:
            frame = bytes(self.buffer[:hash_index + 1])
            self.buffer = bytearray(self.buffer[hash_index + 1:])
            if self._parse_packet(frame):
                parsed = True

        if ticks_diff(ticks_ms(), self.last_time) > self.LOST_SIGNAL_MAX_TIME:
            self.lostSignal = True

        return parsed
`;

  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
}

Blockly.Python['v7rc_begin'] = function(block) {
  v7rcDefinitions();

  var uart_id = Blockly.Python.valueToCode(block, 'UART_ID', Blockly.Python.ORDER_ATOMIC) || '1';
  var rx = Blockly.Python.valueToCode(block, 'RX', Blockly.Python.ORDER_ATOMIC) || '5';
  var baud = Blockly.Python.valueToCode(block, 'BAUD', Blockly.Python.ORDER_ATOMIC) || '115200';

  return `v7rc.begin(${uart_id}, ${rx}, ${baud})\n`;
};

Blockly.Python['v7rc_update'] = function(block) {
  v7rcDefinitions();
  return 'v7rc.update()\n';
};

Blockly.Python['v7rc_command_data'] = function(block) {
  v7rcDefinitions();
  return ['v7rc.commandData', Blockly.Python.ORDER_ATOMIC];
};

// Compatibility alias for older projects.
Blockly.Python['v7rc_command_code'] = function(block) {
  v7rcDefinitions();
  return ['v7rc.commandData', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['v7rc_raw_data'] = function(block) {
  v7rcDefinitions();
  return ['v7rc.rawData', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['v7rc_cmd_text'] = function(block) {
  v7rcDefinitions();
  return ['v7rc.cmdText', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['v7rc_channel_pwm'] = function(block) {
  v7rcDefinitions();
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.channels[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['v7rc_channel_percent'] = function(block) {
  v7rcDefinitions();
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.channelPercents[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['v7rc_channel_signed_percent'] = function(block) {
  v7rcDefinitions();
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.channelSignedPercents[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['v7rc_channel_raw'] = function(block) {
  v7rcDefinitions();
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.rawBytes[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['v7rc_channel_degree'] = function(block) {
  v7rcDefinitions();
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.degrees[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['v7rc_payload_byte'] = function(block) {
  v7rcDefinitions();
  var index = block.getFieldValue('INDEX');
  return [`v7rc.payloadBytes[${index}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['v7rc_lost_signal'] = function(block) {
  v7rcDefinitions();
  return ['v7rc.lostSignal', Blockly.Python.ORDER_ATOMIC];
};

// Arduino fallback
Blockly.JavaScript['v7rc_begin'] = function(block) {
  return '// v7rc extension is for MicroPython code generation.\n';
};
Blockly.JavaScript['v7rc_update'] = function(block) {
  return '// v7rc update is for MicroPython code generation.\n';
};
Blockly.JavaScript['v7rc_command_data'] = function(block) {
  return ['""', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_command_code'] = function(block) {
  return ['""', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_raw_data'] = function(block) {
  return ['""', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_cmd_text'] = function(block) {
  return ['""', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_pwm'] = function(block) {
  return ['1500', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_percent'] = function(block) {
  return ['50', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_signed_percent'] = function(block) {
  return ['0', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_raw'] = function(block) {
  return ['150', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_degree'] = function(block) {
  return ['0', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_payload_byte'] = function(block) {
  return ['0', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_lost_signal'] = function(block) {
  return ['true', Blockly.JavaScript.ORDER_ATOMIC];
};
