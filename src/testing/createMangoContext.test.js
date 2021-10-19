import createMangoContext from "../createMangoContext";
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
            "_rev",
            "year",
            "title"
        ]
    } 
});

const jsonPartitioned = JSON.stringify({
    partitioned:true,
    mango:{
        fields:["foo","bar"]
    }
})

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

describe("createMangoContext", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("success", () => {
        fs.readFile.mockResolvedValue(jsonSuccess);
        return createMangoContext('root','name',true).then(context => {
            expect(context.id).toBe('_design/name');
        });
    });

    test("partitioned error", () => {
        fs.readFile.mockResolvedValue(jsonPartitioned);
        return createMangoContext('root','name',false).catch(error => {
            expect(error).toBe('You cannot create partitioned indexes in a non partitioned database! You can fix it in root/name.');
        });
    });
});