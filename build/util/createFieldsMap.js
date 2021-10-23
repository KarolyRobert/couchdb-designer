"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const createFieldsMap = fields => {
  return doc => {
    let result = {};

    for (let field of fields) {
      let path = field.split('.');

      if (path.length > 1) {
        let exist = true;
        let subDoc = doc;

        for (let key of path) {
          if (typeof subDoc === 'object' && key in subDoc) {
            subDoc = subDoc[key];
          } else {
            exist = false;
            break;
          }
        }

        if (exist) {
          let subResult = result;

          do {
            let key = path.shift();

            if (path.length) {
              subResult[key] = subDoc;
            } else {
              if (key in subResult) {
                subResult = subResult[key];
              } else {
                subResult[key] = {};
                subResult = subResult[key];
              }
            }
          } while (path.length);
        }
      } else {
        if (path[0] in doc) {
          result[path[0]] = doc[path[0]];
        }
      }
    }

    return result;
  };
};

var _default = createFieldsMap;
exports.default = _default;