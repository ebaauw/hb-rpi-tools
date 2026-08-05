// hb-rpi-tools/lib/ds18b20.js
// Copyright © 2019-2026 Erik Baauw.  All rights reserved.
//
// Homebridge RPi Tools.

const ds18b20 = {
  prefix: '/sys/bus/w1/devices/28-',
  postfix: '/temperature',
  validId: (id) => { return /^[0-9a-f]{12}$/.test(id) }
}

export { ds18b20 }
