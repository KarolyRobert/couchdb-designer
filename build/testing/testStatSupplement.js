"use strict";

var _promises = _interopRequireDefault(require("fs/promises"));

var _crypto = _interopRequireDefault(require("crypto"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const refreshTestStats = fileStats => {
  return _promises.default.writeFile(fileStats.testStatFile, fileStats.filePath);
};

const testStatSupplement = (oldStats, fileStat) => {
  return new Promise((resolve, reject) => {
    let fileHash = _crypto.default.createHash('md5').update(oldStats.filePath).digest("hex");

    let tempDirectory = '../../temp';
    let fileStats = { ...oldStats,
      testPath: _path.default.join(tempDirectory, `${fileHash}.js`),
      testModule: _path.default.join(tempDirectory, fileHash),
      isModified: true
    };

    _promises.default.stat(fileStats.testPath).then(currentStat => {
      if (fileStat.mtimeMs < currentStat.mtimeMs) {
        fileStats.isModified = false;
      }

      resolve(fileStats);
    }, err => {
      if (err.code === 'ENOENT') {
        resolve(fileStats);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  testStatSupplement,
  refreshTestStats
};