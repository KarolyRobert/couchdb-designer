import createMangoContext from "./createMangoContext";
import fs from 'fs/promises';


jest.mock('fs/promises');

const jsonSuccess = JSON.stringify({
    "partitioned":false,
    "mongo":{
        "partial_filter_selector": {
            "year": {
                "$gt": 2010
            },
            "limit": 10,
            "skip": 0
        },
        "fields": [
            "_id",
            {"_rev":"asc"},
            "year",
            "title"
        ]
    } 
});


const jsonInvalidPartitioned = JSON.stringify({
    "partitioned":true,
    "mongo":{
        "partial_filter_selector": {
            "year": {
                "$gt": 2010
            },
            "limit": 10,
            "skip": 0
        },
        "fields": [
            "_id",
            "_rev",
            "year",
            "title"
        ]
    } 
});

const jsonWrongSort1 = JSON.stringify({
    "partitioned":false,
    "mongo":{
        "partial_filter_selector": {
            "year": {
                "$gt": 2010
            },
            "limit": 10,
            "skip": 0
        },
        "fields": [
            "_id",
            {"_rev":"desc"},
            "year",
            "title"
        ]
    } 
});

const jsonWrongSort2 = JSON.stringify({
    "partitioned":false,
    "mongo":{
        "partial_filter_selector": {
            "year": {
                "$gt": 2010
            },
            "limit": 10,
            "skip": 0
        },
        "fields":[
            {"_rev":"desc"},
            "_id",
            "year",
            "title"
        ]
    } 
});


const jsonInvalidSort1 = JSON.stringify({
    "partitioned":false,
    "mongo":{
        "partial_filter_selector": {
            "year": {
                "$gt": 2010
            },
            "limit": 10,
            "skip": 0
        },
        "fields":[
            {"_rev":"desac"},
            "_id",
            "year",
            "title"
        ]
    } 
});


const jsonInvalidSort2 = JSON.stringify({
    "partitioned":false,
    "mongo":{
        "partial_filter_selector": {
            "year": {
                "$gt": 2010
            },
            "limit": 10,
            "skip": 0
        },
        "fields":[
            true,
            "_id",
            "year",
            "title"
        ]
    } 
});


const jsonInvalidSort3 = JSON.stringify({
    "partitioned":false,
    "mongo":{
        "partial_filter_selector": {
            "year": {
                "$gt": 2010
            },
            "limit": 10,
            "skip": 0
        },
        "fields":[
            {"helo":"asc","szia":"desc"},
            "_id",
            "year",
            "title"
        ]
    } 
});

describe('createMangoDocument',() => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('success', () => {
        fs.readFile.mockResolvedValue(jsonSuccess);
        return createMangoContext('root','name',true).then(context => {
            expect(fs.readFile.mock.calls[0][0]).toBe('root/name');
            expect(typeof context.views.mongo.map).toBe('function');
            expect(context.views.mongo.reduce).toBe('_count');
            expect(context.views.mongo.options.def).toEqual(JSON.parse(jsonSuccess).mongo);
        });
    });

    test('invalid partitioned', () => {
        fs.readFile.mockResolvedValue(jsonInvalidPartitioned);
        return createMangoContext('root','name',false).catch(error => {
            expect(error).toBe('You cannot create partitioned indexes in a non partitioned database! You can fix it in root/name.');
        });
    });




    test('wrong sort1', () => {
        fs.readFile.mockResolvedValue(jsonWrongSort1);
        return createMangoContext('root','name',true).catch(error => {
            expect(error).toBe('(unsupported_mixed_sort) Sorts currently only support a single direction for all fields. You can fix it in root/name - index: mongo.');
        });
    });

    test('wrong sort2', () => {
        fs.readFile.mockResolvedValue(jsonWrongSort2);
        return createMangoContext('root','name',true).catch(error => {
            expect(error).toBe('(unsupported_mixed_sort) Sorts currently only support a single direction for all fields. You can fix it in root/name - index: mongo.');
        });
    });

    test('invalid sort1', () => {
        fs.readFile.mockResolvedValue(jsonInvalidSort1);
        return createMangoContext('root','name',true).catch(error => {
            expect(error).toBe("(invalid_sort_field) Invalid sort field: { _rev: 'desac' }. You can fix it in root/name,mongo index.");
        });
    });

    test('invalid sort2', () => {
        fs.readFile.mockResolvedValue(jsonInvalidSort2);
        return createMangoContext('root','name',true).catch(error => {
            expect(error).toBe('(invalid_sort_field) Invalid sort field: true. You can fix it in root/name,mongo index.');
        });
    });

    test('invalid sort3', () => {
        fs.readFile.mockResolvedValue(jsonInvalidSort3);
        return createMangoContext('root','name',true).catch(error => {
            expect(error).toBe("(invalid_sort_field) Invalid sort field: { helo: 'asc', szia: 'desc' }. You can fix it in root/name,mongo index.");
        });
    });

});