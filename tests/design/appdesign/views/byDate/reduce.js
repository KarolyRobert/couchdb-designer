function reduce(keys, values, rereduce) {
    var lib = require('lib/couchdb')
    if (rereduce) {
        return sum(values);
    } else {
        return values.length;
    }
}

module.exports = { reduce }