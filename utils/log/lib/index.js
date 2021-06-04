'use strict';

const log = require("npmlog");

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info"; // 判断debug模式
log.heading = "wukong-cli"; // 修改前缀
log.headingStyle = { fg: "white", bg: "black" };
log.addLevel("success", 2000, { fg: "green", bold: true })

module.exports = log;
// function log() {
//   // log.info("cli", "test");
// }
