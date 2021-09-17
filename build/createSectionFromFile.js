"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createDesignSectionFromFile = _interopRequireDefault(require("./createDesignSectionFromFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createSectionFromFile = async (directory, fileName, test = false) => {
  if (test) {} else {
    return (0, _createDesignSectionFromFile.default)(directory, fileName);
  }
};

var _default = createSectionFromFile;
exports.default = _default;