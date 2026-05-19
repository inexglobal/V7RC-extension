Blockly.Python.forBlock['v7rc_begin'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';

  var uart_id = Blockly.Python.valueToCode(block, 'UART_ID', Blockly.Python.ORDER_ATOMIC) || '0';
  var rx = Blockly.Python.valueToCode(block, 'RX', Blockly.Python.ORDER_ATOMIC) || '1';
  var baud = Blockly.Python.valueToCode(block, 'BAUD', Blockly.Python.ORDER_ATOMIC) || '115200';

  return `v7rc.begin(${uart_id}, ${rx}, ${baud})\n`;
};

Blockly.Python.forBlock['v7rc_update'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  return 'v7rc.update()\n';
};

Blockly.Python.forBlock['v7rc_command_data'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  return ['v7rc.commandData', Blockly.Python.ORDER_ATOMIC];
};

// Compatibility alias for older projects.
Blockly.Python.forBlock['v7rc_command_code'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  return ['v7rc.commandData', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['v7rc_raw_data'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  return ['v7rc.rawData', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['v7rc_cmd_text'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  return ['v7rc.cmdText', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['v7rc_channel_pwm'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.channels[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['v7rc_channel_percent'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.channelPercents[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['v7rc_channel_signed_percent'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.channelSignedPercents[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['v7rc_channel_raw'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.rawBytes[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['v7rc_channel_degree'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  var ch = block.getFieldValue('CHANNEL');
  return [`v7rc.degrees[${ch}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['v7rc_payload_byte'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  var index = block.getFieldValue('INDEX');
  return [`v7rc.payloadBytes[${index}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['v7rc_lost_signal'] = function (block) {
  Blockly.Python.definitions_['v7rc_class'] = 'from V7RC_lib import V7RC';
  Blockly.Python.definitions_['v7rc_object'] = 'v7rc = V7RC()';
  return ['v7rc.lostSignal', Blockly.Python.ORDER_ATOMIC];
};

// Arduino fallback
Blockly.JavaScript['v7rc_begin'] = function (block) {
  return '// v7rc extension is for MicroPython code generation.\n';
};
Blockly.JavaScript['v7rc_update'] = function (block) {
  return '// v7rc update is for MicroPython code generation.\n';
};
Blockly.JavaScript['v7rc_command_data'] = function (block) {
  return ['""', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_command_code'] = function (block) {
  return ['""', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_raw_data'] = function (block) {
  return ['""', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_cmd_text'] = function (block) {
  return ['""', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_pwm'] = function (block) {
  return ['1500', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_percent'] = function (block) {
  return ['50', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_signed_percent'] = function (block) {
  return ['0', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_raw'] = function (block) {
  return ['150', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_channel_degree'] = function (block) {
  return ['0', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_payload_byte'] = function (block) {
  return ['0', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['v7rc_lost_signal'] = function (block) {
  return ['true', Blockly.JavaScript.ORDER_ATOMIC];
};
