Copyright © 2019-2026 Erik Baauw. All rights reserved.

## Introduction
This repository contains command-line tool and supporting utility classes for 
[Homebridge RPi](https://github.com/ebaauw/homebridge-rpi).

### Command-Line Utility
The Homebridge RPi plugin comes with a command-line tool for troubleshooting the connection to a Rapsberry Pi.

Tool      | Description
--------- | -----------
`rpi`     | Command line interface to Raspberry Pi.

The command-line tool takes a `-h` or `--help` argument to provide a brief overview of its functionality and command-line arguments.

### Utility Classes
The Homebridge RPi Tools library provides a number of utility classes for Homebridge plugins and/or command-line tools.

Class                         | Description
----------------------------- | -----------
{@link GpioClient}            | Abstract superclass to access GPIO pins.
{@link GpioClient.Pigpio}     | Implementation of `GpioClient` for [`pigpio`](https://github.com/joan2937/pigpio).
{@link GpioClient.Rgpio}      | Implementation of `GpioClient` for [`lg`](https://github.com/joan2937/lg).
{@link LedChainClient}        | Abstract superclass to control a LED chain, with GPIO pins for clock and data.
{@link LedChainClient.Blinkt} | Implementation of `LedChainClient` for Pimoroni [Blinkt!](https://shop.pimoroni.com/products/blinkt) and [FanSHIM](https://shop.pimoroni.com/products/fan-shim).
{@link LedChainClient.P9813}  | Implementation of `LedChainClient` for P9813 based LED chains, like the Grove [Chainable LED](https://github.com/Seeed-Studio/Grove_Chainable_RGB_LED).
{@link DhtClient}             | Class to interact with a DHTxx temperature/humibidy sensor.
{@link RpiInfo}               | Class to handle information about and state of a Raspberry Pi.
{@link RpiTool}               | `rpi` command-line utility.
