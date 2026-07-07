#!/bin/sh
# Node 25 把裸目录参数当模块解析会报错，用 glob 更稳
cd "$(dirname "$0")/.." && node --test "tests/*.test.js"
