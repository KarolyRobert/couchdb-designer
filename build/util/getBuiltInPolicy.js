"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getURI = (contextProps, name, type) => {
  let ddocName = contextProps.root.split(_path.default.sep).pop();
  let designName = contextProps.name ? `_design/${contextProps.name}` : `_design/${ddocName}`;

  switch (type) {
    case 'show':
      return `testdatabase/${designName}/_show/${name}`;

    case 'list':
      return `testdatabase/${designName}/_list/${name}`;

    case 'update':
      return `testdatabase/${designName}/_update/${name}`;

    case 'filter':
      return `testdatabase/_changes`;
  }
};

const getBuiltInPolicy = (fileStats, contextProps, name) => {
  let typePath = fileStats.typePath[fileStats.typePath.length - 1] === name ? fileStats.typePath : [...fileStats.typePath, name];
  let functionType = 'library';

  switch (typePath[0]) {
    case 'views':
      if (typePath.length === 3 && name === 'map') functionType = 'map';
      if (typePath.length === 3 && name === 'reduce') functionType = 'reduce';
      break;

    case 'updates':
      if (typePath.length === 2) functionType = 'update';
      break;

    case 'shows':
      if (typePath.length === 2) functionType = 'show';
      break;

    case 'lists':
      if (typePath.length === 2) functionType = 'list';
      break;

    case 'filters':
      if (typePath.length === 2) functionType = 'filter';
      break;

    case 'indexes':
      if (typePath.length === 3 && name === 'index') functionType = 'index';
      break;

    case 'validate_doc_update':
      if (typePath.length === 1) functionType = 'validate';
      break;

    case 'rewrites':
      if (typePath.length === 1) functionType = 'rewrite';
  }

  if (functionType === 'library' && fileStats.isLib) {
    return {
      allowed: [],
      denied: ['Require'],
      type: functionType
    };
  } else if (functionType === 'library') {
    throw {
      testError: `Your module ${fileStats.filePath} doesn't match to rules of couchdb design document! If it is a common js library please follow the rule the filename in form name.lib.js for proper ddoc generation.`
    };
  }

  let policy;

  switch (functionType) {
    case 'map':
      policy = {
        allowed: ['Emit', 'Require'],
        denied: ['GetRow', 'Provides', 'RegisterType', 'Start', 'Send', 'Index']
      };
      break;

    case 'reduce':
      policy = {
        allowed: [],
        denied: ['Emit', 'Require', 'GetRow', 'Provides', 'RegisterType', 'Start', 'Send', 'Index']
      };
      break;

    case 'update':
    case 'validate':
    case 'filter':
    case 'rewrite':
      policy = {
        allowed: ['Require'],
        denied: ['Emit', 'GetRow', 'Provides', 'RegisterType', 'Start', 'Send', 'Index']
      };
      break;

    case 'show':
      policy = {
        allowed: ['Require', 'Provides', 'RegisterType'],
        denied: ['Emit', 'GetRow', 'Start', 'Send', 'Index']
      };
      break;

    case 'list':
      policy = {
        allowed: ['Require', 'Provides', 'RegisterType', 'GetRow', 'Start', 'Send'],
        denied: ['Emit', 'Index']
      };
      break;

    case 'index':
      policy = {
        allowed: ['Index'],
        denied: ['Emit', 'Require', 'Provides', 'RegisterType', 'GetRow', 'Start', 'Send']
      };
  }

  if (['update', 'show', 'list', 'filter'].includes(functionType)) {
    return { ...policy,
      uri: getURI(contextProps, name, functionType)
    };
  }

  return policy;
};

var _default = getBuiltInPolicy;
exports.default = _default;