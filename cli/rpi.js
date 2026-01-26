#!/usr/bin/env node

// hb-rpi-tools/cli/rpi.js
// Copyright © 2019-2026 Erik Baauw. All rights reserved.
//
// Homebridge RPi Tools.

import { createRequire } from 'node:module'

import { RpiTool } from 'hb-rpi-tools/RpiTool'

const require = createRequire(import.meta.url)
const packageJson = require('../package.json')

new RpiTool(packageJson).main()
