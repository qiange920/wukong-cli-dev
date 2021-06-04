"use strict";

const axios = require("axios");
const urlJoin = require("url-join");
const semver = require("semver");

async function getNpmVersion(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}

function getSemverVersion(baseVersion, versions) {
  return versions.filter(version => semver.satisfies(version, `^${baseVersion}`)).sort((a, b) => semver.gt(b, a));
  return versions
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersion(npmName, registry);
  const newVersions = getSemverVersion(baseVersion, versions);
  if (newVersions && newVersions.length) {
    return newVersions[0];
  }
}

function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  // console.log(npmInfoUrl)
  return axios
    .get(npmInfoUrl)
    .then((res) => {
      // console.log(res)
      if (res.status === 200) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org";
}

module.exports = { getNpmInfo, getNpmVersion, getSemverVersion, getNpmSemverVersion };
