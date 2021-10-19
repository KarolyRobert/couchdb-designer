"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _compileSelector = _interopRequireDefault(require("../../util/compileSelector"));

var _compareAny = _interopRequireDefault(require("../../util/compareAny"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const filters = {
  "$eq": (docValue, filterValue) => {
    if (docValue !== undefined) {
      if ((0, _compareAny.default)(docValue, filterValue) === 0) {
        return true;
      }
    }

    return false;
  },
  "$and": (docValue, filterValue) => {
    let result = true;

    for (let filter of filterValue) {
      result = result && mangoFilter(docValue, filter);

      if (!result) {
        return false;
      }
    }

    return result;
  },
  "$lt": (docValue, filterValue) => {
    if (docValue !== undefined) {
      if ((0, _compareAny.default)(docValue, filterValue) < 0) {
        return true;
      }
    }

    return false;
  },
  "$lte": (docValue, filterValue) => {
    if (docValue !== undefined) {
      if ((0, _compareAny.default)(docValue, filterValue) <= 0) {
        return true;
      }
    }

    return false;
  },
  "$gt": (docValue, filterValue) => {
    if (docValue !== undefined) {
      if ((0, _compareAny.default)(docValue, filterValue) > 0) {
        return true;
      }
    }

    return false;
  },
  "$gte": (docValue, filterValue) => {
    if (docValue !== undefined) {
      if ((0, _compareAny.default)(docValue, filterValue) >= 0) {
        return true;
      }
    }

    return false;
  },
  "$ne": (docValue, filterValue) => {
    if (docValue !== undefined) {
      if ((0, _compareAny.default)(docValue, filterValue) !== 0) {
        return true;
      }
    }

    return false;
  },
  "$exists": (docValue, filterValue) => {
    let exists = docValue !== undefined;
    return exists === filterValue;
  },
  "$type": (docValue, filterValue) => {
    let docType = docValue === null ? 'null' : Array.isArray(docValue) ? 'array' : typeof docValue;
    return docType === filterValue;
  },
  "$in": (docValue, filterValue) => {
    if (docValue !== undefined) {
      for (let element of filterValue) {
        if ((0, _compareAny.default)(element, docValue) === 0) {
          return true;
        }
      }
    }

    return false;
  },
  "$nin": (docValue, filterValue) => {
    return !filters['$in'](docValue, filterValue);
  },
  "$size": (docValue, filterValue) => {
    if (docValue !== undefined && Array.isArray(docValue)) {
      return docValue.length === filterValue;
    }

    return false;
  },
  "$mod": (docValue, filterValue) => {
    if (docValue !== undefined && Number.isInteger(docValue)) {
      return docValue % filterValue[0] === filterValue[1];
    }

    return false;
  },
  "$regex": (docValue, filterValue) => {
    if (docValue !== undefined && typeof docValue === "string") {
      return false;
    }

    return false;
  },
  "$or": (docValue, filterValue) => {
    let result = false;

    for (let filter of filterValue) {
      result = result || mangoFilter(docValue, filter);

      if (result) {
        break;
      }
    }

    return result;
  },
  "$not": (docValue, filterValue) => {
    return !mangoFilter(docValue, filterValue);
  },
  "$nor": (docValue, filterValue) => {
    return !filters["or"](docValue, filterValue);
  },
  "$all": (docValue, filterValue) => {
    if (docValue !== undefined && Array.isArray(docValue)) {
      for (let value of filterValue) {
        let include = false;

        for (let element of docValue) {
          include = include || (0, _compareAny.default)(element, value) === 0;

          if (include) {
            break;
          }
        }

        if (!include) {
          return false;
        }
      }

      return true;
    }

    return false;
  },
  "$elemMatch": (docValue, filterValue) => {
    if (docValue !== undefined && Array.isArray(docValue)) {
      for (let value of docValue) {
        if (mangoFilter(value, filterValue)) {
          return true;
        }
      }
    }

    return false;
  },
  "$allMatch": (docValue, filterValue) => {
    if (docValue !== undefined && Array.isArray(docValue)) {
      let result = true;

      for (let value of docValue) {
        result = result && mangoFilter(value, filterValue);

        if (!result) {
          return false;
        }
      }

      return true;
    }

    return false;
  },
  "$keyMapMatch": (docValue, filterValue) => {
    if (docValue !== undefined && typeof docValue === "object" && !Array.isArray(docValue)) {
      let keys = Object.keys(docValue);

      for (let key of keys) {
        if (mangoFilter(docValue[key], filterValue)) {
          return true;
        }
      }
    }

    return false;
  }
};

const mangoFilter = (doc, filter) => {
  let filterKey = Object.keys(filter)[0];

  if (filterKey in filters) {
    return filters[filterKey](doc, filter[filterKey]);
  } else {
    let docTree = doc;
    let filterPath = filterKey.split('.');

    for (let branch of filterPath) {
      if (branch in docTree) {
        docTree = docTree[branch];
      } else {
        docTree = undefined;
        break;
      }
    }

    return mangoFilter(docTree, filter[filterKey]);
  }
};

const createMangoFilter = selector => {
  if (selector && Object.keys(selector).length) {
    let filter = (0, _compileSelector.default)(selector);
    return doc => {
      return mangoFilter(doc, filter);
    };
  } else {
    return () => true;
  }
};

var _default = createMangoFilter;
exports.default = _default;