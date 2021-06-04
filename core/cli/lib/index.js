"use strict";

module.exports = core;

const path = require("path");
const constant = require("./const.js");
const pkg = require("../package.json");
const log = require("@wukong-cli-dev/log");
const semver = require("semver");
const colors = require("colors/safe");
const userHome = require("user-home");
const pathExists = require("path-exists").sync;

let args;
async function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    // log.verbose("debug", "test debug log");
    checkEnv();
    await checkGlobalUpdate();
  } catch (e) {
    log.error(e.message);
  }
}

async function checkGlobalUpdate(params) {
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  const { getNpmSemverVersion } = require("@wukong-cli-dev/get-npm-info");
  const lastVersions = await getNpmSemverVersion(currentVersion, npmName);
  if (lastVersions && semver.gt(lastVersions, currentVersion)) {
    log.warn("更新提示", colors.yellow(`请手动更新 ${npmName}, 当前版本${currentVersion}, 最新版本${lastVersions}
更新命令： npm install -g ${npmName}`))
  }
}

function checkEnv() {
  const dotenv = require("dotenv");
  const dotenvPath = path.resolve(userHome, ".env");
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  createDefaultConfig();
  log.verbose("环境变量", process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
  // return cliConfig
}

function checkInputArgs() {
  const minimist = require("minimist");
  args = minimist(process.argv.slice(2));
  checkArgs();
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  console.log(process.env.LOG_LEVEL);
  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  console.log(userHome);
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在"));
  }
}

function checkPkgVersion() {
  // console.log(pkg.version)
  // log.success("test", "success...");
  // log.notice("cli", pkg.version);
  log.info("cli", pkg.version);
}

function checkNodeVersion() {
  const currentVersion = process.version;
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`wukong-cli 需要安装 v${lowestVersion} 以上版本的Node.js`)
    );
  }
}

function checkRoot() {
  const rootCheck = require("root-check");
  rootCheck();
  // console.log(process.geteuid())
}
