# v7rc

microBlock IDE extension for the V7RC IO Command Protocol on MicroPython.

This extension is a protocol receiver and value converter. It is not tied to Pico-X, motors, or any specific output device.

## Supported commands

- `SRV` Basic PWM Control
- `SR2` Second PWM Group, mapped to channel 4..7
- `SRT` Tank mode based on basic PWM
- `SS8` Simplified PWM for 8 channels
- `HEX` 16-channel raw byte PWM control
- `DEG` 16-channel angle control
- `CMD` pass-through command
- `LED`, `LE2`, `LE?` LED payload receiver

## Toolbox sections

### General

- `V7RC begin UART ... RX pin ... baud ...`
- `V7RC update`
- `V7RC channel CHx read PWM us`
- `V7RC channel CHx PWM percent 0-100`
- `V7RC channel CHx PWM signed percent -100 to 100`
- `V7RC lost signal`

### Debug / Protocol

- `V7RC command data`
- `V7RC raw data`
- `V7RC CMD text`
- `V7RC channel CHx raw byte`
- `V7RC channel CHx degree`
- `V7RC payload byte x`

## Terminology

`command data` means the 3-character command identifier, such as `SRV`, `SS8`, `HEX`, `DEG`, `CMD`, or `LED`.

`raw data` means the latest V7RC packet represented as a readable string when possible.

`read PWM us` means the PWM-style microsecond value read from the V7RC protocol, such as `1000`, `1500`, or `2000`.

This value does not have to be used to drive PWM immediately. The name `read PWM us` means it is the value read from the protocol before you convert or use it elsewhere.

## PWM conversion: 0 to 100%

```text
1000 us = 0%
1500 us = 50%
2000 us = 100%
```

Formula:

```python
percent = int((pwm_us - 1000) * 100 / 1000)
```

## Signed PWM conversion: -100 to 100

This matches the orange joystick value shown in the V7RC app UI.

```text
1000 us = -100
1500 us = 0
2000 us = 100
```

Formula:

```python
signed_percent = int((pwm_us - 1500) * 100 / 500)
```

Examples:

```text
1687 us ≈ 37
1509 us ≈ 1
1026 us ≈ -94
1354 us ≈ -29
```

## Recommended block layout

```text
Setup
└─ V7RC begin UART 1 RX pin 5 baud 115200

Loop
└─ V7RC update
```

Then use the channel blocks depending on your application:

```text
V7RC channel CH0 read PWM us
V7RC channel CH0 PWM percent 0-100
V7RC channel CH0 PWM signed percent -100 to 100
```

## Compatibility notes

The block type for update remains `v7rc_update`, so older projects should continue to work.

The generator uses RP2350-safe `bytearray` slicing instead of item deletion. This avoids errors such as:

```text
TypeError: 'bytearray' object doesn't support item deletion
```


## Version 1.4.3 fix

Fixed MicroPython syntax error caused by an escaped `\x` text representation in generated code.

The generator now uses:

```python
out += chr(92) + "x%02X" % b
```

instead of emitting a direct `\x` string escape.
