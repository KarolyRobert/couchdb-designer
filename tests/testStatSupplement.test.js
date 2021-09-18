import testStatSupplement  from '../src/testing/testStatSupplement';
import fs from 'fs/promises';

jest.mock('fs/promises');

const fileStats = { 
    isJSON : false,
     isLib : true, 
     name : "map", 
     filePath: "./appdesign/views/cloud/map.js", 
     isJavaScript: true
    }
const fileStat = { 
    mtimeMs : 1000
}

describe('testStatSupplement',() => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('unmodifyed',() => {
        expect.assertions(1);
        fs.stat.mockResolvedValue({mtimeMs: 1100});
        testStatSupplement(fileStats,fileStat).then(result => {
            expect(result).toMatchSnapshot();
        });
    });

    test('modifyed',() => {
        expect.assertions(1);
        fs.stat.mockResolvedValue({mtimeMs: 900});
        testStatSupplement(fileStats,fileStat).then(result => {
            expect(result).toMatchSnapshot();
        });
    });

    test('modifyed on testStatfile not exist',() => {
        expect.assertions(1);
        fs.stat.mockRejectedValue({code:'ENOENT'});
        testStatSupplement(fileStats,fileStat).then(result => {
            expect(result).toMatchSnapshot();
        });
    });

    test('reject on testStatfile statcheck fail',() => {
        expect.assertions(1);
        fs.stat.mockRejectedValue({code:'SOMEOTHERERROR'});
        testStatSupplement(fileStats,fileStat).catch(result => {
            expect(result).toStrictEqual({code:'SOMEOTHERERROR'});
        });
    });




});