#!/usr/bin/env node

import * as program from 'caporal'
import * as updateNotifier from 'update-notifier'

import start from './start'

const pkg = require('../package.json')

// 设置版本号
program.version(pkg.version)
// 设置自动更新提示
const notifier = updateNotifier({
  pkg,
  // 一周
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7,
})
notifier.notify()

program
  .command('start', '启动同步服务')
  .argument('target', '代理服务地址')
  .option('--port <port>', '端口号', program.INT, 8686)
  .action(start)

program.parse(process.argv)
