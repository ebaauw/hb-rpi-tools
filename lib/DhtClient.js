// hb-rpi-tools/lib/DhtClient.js
// Copyright © 2019-2026 Erik Baauw.  All rights reserved.
//
// Homebridge RPi Tools.

import { EventEmitter, once } from 'node:events'

/** Class to read a DHTxx sensor connected to a GPIO pin.
  *
  * @class
  * @extends EventEmitter
  */
class DhtClient extends EventEmitter {
  constructor (parent, pi, gpio) {
    super()
    this.debug = parent.debug.bind(parent)
    this.vdebug = parent.vdebug.bind(parent)
    this.pi = pi
    this.gpio = gpio

    this.pi.on('gpio' + this.gpio, (payload) => {
      if (payload.value) {
        const duration = payload.tick - (this._previousTick ?? 0)
        this._previousTick = payload.tick
        this.#update(duration)
      }
    })
  }

  async read () {
    const timeout = setTimeout(() => {
      this.emit('error', new Error(`gpio ${this.gpio}: timeout`))
    }, this.pi._params.timeout * 1000)
    this.pi.dhtRead(this.gpio)
    const a = await once(this, 'dht')
    clearTimeout(timeout)
    return a[0]
  }

  #update (duration) {
    this.vdebug('gpio %d: rise after %d µs', this.gpio, duration)
    if (duration > 10000) {
      this.receiving = true
      this.bit = this.pi.port === 8888 ? -2 : 0
      this.data = 0n
    } else if (this.receiving) {
      if (++this.bit >= 1) {
        this.data <<= 1n
        if (duration >= 60 && duration <= 100) {
          // 0 bit
          this.vdebug('gpio %d: bit %d: 0', this.gpio, this.bit)
        } else if (duration > 100 && duration <= 160) {
          this.data += 1n // 1 bit
          this.vdebug('gpio %d: bit %d: 1', this.gpio, this.bit)
        } else {
          this.receiving = false // invalid
          this.debug('gpio %d: invalid signal', this.gpio)
        }
        if (this.receiving && this.bit === 40) {
          const buf = Buffer.alloc(8)
          buf.writeBigUint64LE(this.data)
          if (((buf[1] + buf[2] + buf[3] + buf[4]) & 0xFF) !== buf[0]) {
            this.debug('gpio %d: bad checksum', this.gpio)
            return
          }
          let ok = false
          let sensor = 'DHTxx'
          let temperature = buf.readInt16LE(1) / 10
          let humidity = buf.readUint16LE(3) / 10
          ok = temperature >= -40 && temperature <= 125 && humidity <= 100
          if (!ok) {
            sensor = 'DHT11'
            temperature = buf[2]
            humidity = buf[4]
            ok = temperature <= 50 && humidity >= 20 && humidity <= 80
          }
          if (!ok) {
            this.debug('gpio %d: invalid data', this.gpio)
            return
          }
          this.debug(
            'gpio %d: %s: temperature: %d, humidity: %d',
            this.gpio, sensor, temperature, humidity
          )
          this.emit('dht', { temperature, humidity })
        }
      }
    }
  }
}

export { DhtClient }
