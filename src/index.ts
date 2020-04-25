#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import * as program from 'commander'
import * as updateNotifier from 'update-notifier'

import start from './start'

const pkg = require('../package.json')

// 设置版本号
program.version(pkg.version)
// 设置自动更新提示
const notifier = updateNotifier({
  pkg,
  // 一周
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7
})
notifier.notify()

program
  .command('start')
  .description('启动同步服务')
  .option('-a, --address <address>', '需要代理的地址', 'http://127.0.0.1:9001')
  .option('-p, --port <port>', '端口号', '9002')
  .action(start)

program.parse(process.argv)
