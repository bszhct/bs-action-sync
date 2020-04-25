#!/usr/bin/env node
/* eslint-disable no-param-reassign */

import * as http from 'http'
import * as fs from 'fs-extra'
import * as chalk from 'chalk'
import * as httpProxy from 'http-proxy'
import * as websocket from 'socket.io'
import { Command } from 'commander'

// 终端列表
const sockets = {}

export default (cmd: Command): void => {
  const { address, port } = cmd
  const proxy = httpProxy.createProxyServer()

  const server = http.createServer((req, res) => {
    // 如果是 html, 动态写入脚本
    if (req.method === 'GET' && req.headers.accept && req.headers.accept.includes('text/html')) {
      res.writeHead(200, {
        'Content-type': 'text/html'
      })
      const clientJs = fs.readFileSync(`${__dirname}/io-client.min.js`)
        .toString()
        .replace(/%port%/, port)
      res.write(`<script>${clientJs}</script>`)
    }

    proxy.web(req, res, { target: address })
  })

  // 创建 io 连接
  const io = websocket(server, {
    serveClient: false,
    cookie: false
  })

  const root = io.of('/')

  root.on('connection', socket => {
    // 如果当前连接不存在的话进行保存
    if (!sockets[socket.id]) {
      const { query } = socket.handshake

      sockets[socket.id] = {
        connect: true,
        ua: socket.request.headers['user-agent'],
        time: new Date(),
        pathname: query.pathname
      }
    }

    // 同步点击事件
    socket.on('event of click', params => {
      params.sync = false
      socket.broadcast.emit('event of click', params)
    })
    // 同步滚动事件
    socket.on('event of scroll', params => {
      params.sync = false
      socket.broadcast.emit('event of scroll', params)
    })

    socket.on('disconnect', () => {
      console.log(`${chalk.yellow('[bs]')} 连接已断开`)
    })
  })

  server.listen(port, () => {
    console.log(`${chalk.yellow('[bs]')} 服务已启动: http://0.0.0.0:${port}`)
  })
}
