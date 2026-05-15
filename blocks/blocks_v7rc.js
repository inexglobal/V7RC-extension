Blockly.defineBlocksWithJsonArray([
{
  "type": "v7rc_begin",
  "message0": "V7RC begin UART %1 RX pin %2 baud %3",
  "args0": [
    {"type": "input_value", "name": "UART_ID", "check": "Number"},
    {"type": "input_value", "name": "RX", "check": "Number"},
    {"type": "input_value", "name": "BAUD", "check": "Number"}
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#CF131C",
  "tooltip": "Start V7RC receiver using MicroPython UART.",
  "helpUrl": ""
},
{
  "type": "v7rc_update",
  "message0": "V7RC update",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#CF131C",
  "tooltip": "Read and parse the latest V7RC packet.",
  "helpUrl": ""
},
{
  "type": "v7rc_command_data",
  "message0": "V7RC command data",
  "output": "String",
  "colour": "#CF131C",
  "tooltip": "Return latest command data such as SRV, SR2, SRT, SS8, HEX, DEG, CMD, LED, LE2, LE5.",
  "helpUrl": ""
},
{
  "type": "v7rc_command_code",
  "message0": "V7RC command data",
  "output": "String",
  "colour": "#CF131C",
  "tooltip": "Compatibility block. Return latest command data such as SRV, HEX, DEG, CMD.",
  "helpUrl": ""
},
{
  "type": "v7rc_raw_data",
  "message0": "V7RC raw data",
  "output": "String",
  "colour": "#CF131C",
  "tooltip": "Return latest raw data packet as readable string when possible.",
  "helpUrl": ""
},
{
  "type": "v7rc_cmd_text",
  "message0": "V7RC CMD text",
  "output": "String",
  "colour": "#CF131C",
  "tooltip": "Return pass-through CMD payload text without right-side padding spaces.",
  "helpUrl": ""
},
{
  "type": "v7rc_channel_pwm",
  "message0": "V7RC channel %1 read PWM us",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "CHANNEL",
      "options": [
        ["CH0", "0"],
        ["CH1", "1"],
        ["CH2", "2"],
        ["CH3", "3"],
        ["CH4", "4"],
        ["CH5", "5"],
        ["CH6", "6"],
        ["CH7", "7"],
        ["CH8", "8"],
        ["CH9", "9"],
        ["CH10", "10"],
        ["CH11", "11"],
        ["CH12", "12"],
        ["CH13", "13"],
        ["CH14", "14"],
        ["CH15", "15"]
      ]
    }
  ],
  "output": "Number",
  "colour": "#CF131C",
  "tooltip": "Return V7RC channel value as a PWM-style microsecond reading. Usually 1000 to 2000 us.",
  "helpUrl": ""
},
{
  "type": "v7rc_channel_percent",
  "message0": "V7RC channel %1 PWM percent 0-100",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "CHANNEL",
      "options": [
        ["CH0", "0"],
        ["CH1", "1"],
        ["CH2", "2"],
        ["CH3", "3"],
        ["CH4", "4"],
        ["CH5", "5"],
        ["CH6", "6"],
        ["CH7", "7"],
        ["CH8", "8"],
        ["CH9", "9"],
        ["CH10", "10"],
        ["CH11", "11"],
        ["CH12", "12"],
        ["CH13", "13"],
        ["CH14", "14"],
        ["CH15", "15"]
      ]
    }
  ],
  "output": "Number",
  "colour": "#CF131C",
  "tooltip": "Convert channel read PWM us from 1000-2000 to 0-100 percent. 1000=0%, 1500=50%, 2000=100%.",
  "helpUrl": ""
},
{
  "type": "v7rc_channel_signed_percent",
  "message0": "V7RC channel %1 PWM signed percent -100 to 100",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "CHANNEL",
      "options": [
        ["CH0", "0"],
        ["CH1", "1"],
        ["CH2", "2"],
        ["CH3", "3"],
        ["CH4", "4"],
        ["CH5", "5"],
        ["CH6", "6"],
        ["CH7", "7"],
        ["CH8", "8"],
        ["CH9", "9"],
        ["CH10", "10"],
        ["CH11", "11"],
        ["CH12", "12"],
        ["CH13", "13"],
        ["CH14", "14"],
        ["CH15", "15"]
      ]
    }
  ],
  "output": "Number",
  "colour": "#CF131C",
  "tooltip": "Convert channel read PWM us from 1000-2000 to signed percent. 1000=-100, 1500=0, 2000=100. This matches the orange value in V7RC UI.",
  "helpUrl": ""
},
{
  "type": "v7rc_channel_raw",
  "message0": "V7RC channel %1 raw byte",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "CHANNEL",
      "options": [
        ["CH0", "0"],
        ["CH1", "1"],
        ["CH2", "2"],
        ["CH3", "3"],
        ["CH4", "4"],
        ["CH5", "5"],
        ["CH6", "6"],
        ["CH7", "7"],
        ["CH8", "8"],
        ["CH9", "9"],
        ["CH10", "10"],
        ["CH11", "11"],
        ["CH12", "12"],
        ["CH13", "13"],
        ["CH14", "14"],
        ["CH15", "15"]
      ]
    }
  ],
  "output": "Number",
  "colour": "#CF131C",
  "tooltip": "Return channel raw byte value. HEX and DEG use raw bytes directly; SRV/SR2/SRT convert read PWM us to value / 10.",
  "helpUrl": ""
},
{
  "type": "v7rc_channel_degree",
  "message0": "V7RC channel %1 degree",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "CHANNEL",
      "options": [
        ["CH0", "0"],
        ["CH1", "1"],
        ["CH2", "2"],
        ["CH3", "3"],
        ["CH4", "4"],
        ["CH5", "5"],
        ["CH6", "6"],
        ["CH7", "7"],
        ["CH8", "8"],
        ["CH9", "9"],
        ["CH10", "10"],
        ["CH11", "11"],
        ["CH12", "12"],
        ["CH13", "13"],
        ["CH14", "14"],
        ["CH15", "15"]
      ]
    }
  ],
  "output": "Number",
  "colour": "#CF131C",
  "tooltip": "Return channel angle degree from DEG command. Formula: degree = value - 127.",
  "helpUrl": ""
},
{
  "type": "v7rc_payload_byte",
  "message0": "V7RC payload byte %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "INDEX",
      "options": [
        ["0", "0"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
        ["5", "5"],
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"],
        ["12", "12"],
        ["13", "13"],
        ["14", "14"],
        ["15", "15"]
      ]
    }
  ],
  "output": "Number",
  "colour": "#CF131C",
  "tooltip": "Return raw payload byte index 0..15 from HEX, DEG, LED, LE2, LE?.",
  "helpUrl": ""
},
{
  "type": "v7rc_lost_signal",
  "message0": "V7RC lost signal",
  "output": "Boolean",
  "colour": "#CF131C",
  "tooltip": "Return True when no valid packet is received within fail-safe time.",
  "helpUrl": ""
}
]);
