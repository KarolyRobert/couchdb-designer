"use strict";

const secObj = {
  members: {
    roles: ["_admin"]
  },
  admins: {
    roles: ["_admin"]
  }
};
const userCtx = {
  db: '',
  name: null,
  roles: ["_admin"]
};
module.exports = {
  secObj,
  userCtx
};