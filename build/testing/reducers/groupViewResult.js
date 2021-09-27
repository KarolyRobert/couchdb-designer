"use strict";

const groupViewResult = (rows, level) => {
  let result = [];
  let index = -1;
  let currentKey = [];
  rows.forEach(record => {
    let Key = record.key.filter((value, index) => index < level);
    let newGroup = false;

    for (let kindex in Key) {
      if (currentKey[kindex] !== Key[kindex]) {
        newGroup = true;
        currentKey[kindex] = Key[kindex];
      }
    }

    if (newGroup) {
      index++;
      result.push([]);
    }

    result[index].push({ ...record,
      key: currentKey
    });
  });
  return result;
};