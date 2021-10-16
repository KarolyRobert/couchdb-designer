import createMangoDocument from "./createMangoDocument";
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
        return createMangoDocument('root','name').then(result => {
            expect(fs.readFile.mock.calls[0][0]).toBe('root/name');
            expect(result).toMatchSnapshot();
        });
    });


    test('wrong sort1', () => {
        fs.readFile.mockResolvedValue(jsonWrongSort1);
        return createMangoDocument('root','name').catch(error => {
            expect(error).toBe('(unsupported_mixed_sort) Sorts currently only support a single direction for all fields. You can fix it in root/name - index: mongo.');
        });
    });

    test('wrong sort2', () => {
        fs.readFile.mockResolvedValue(jsonWrongSort2);
        return createMangoDocument('root','name').catch(error => {
            expect(error).toBe('(unsupported_mixed_sort) Sorts currently only support a single direction for all fields. You can fix it in root/name - index: mongo.');
        });
    });

    test('invalid sort1', () => {
        fs.readFile.mockResolvedValue(jsonInvalidSort1);
        return createMangoDocument('root','name').catch(error => {
            expect(error).toBe('(invalid_sort_field) Invalid sort field: _rev:desac. You can fix it in root/name,mongo index.');
        });
    });

    test('invalid sort2', () => {
        fs.readFile.mockResolvedValue(jsonInvalidSort2);
        return createMangoDocument('root','name').catch(error => {
            expect(error).toBe('(invalid_sort_field) Invalid sort field: true. You can fix it in root/name,mongo index.');
        });
    });

    test('invalid sort3', () => {
        fs.readFile.mockResolvedValue(jsonInvalidSort3);
        return createMangoDocument('root','name').catch(error => {
            expect(error).toBe('(invalid_sort_field) Invalid sort field: helo:asc. You can fix it in root/name,mongo index.');
        });
    });

});