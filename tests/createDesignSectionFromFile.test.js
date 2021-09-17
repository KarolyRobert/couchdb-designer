import createDesignSectionFromFile from '../src/section/createDesignSectionFromFile';
import loadModule from '../src/util/loadModule';
import fs from 'fs/promises';

jest.mock('fs/promises');
jest.mock('../src/util/loadModule');


describe('createSectionFromFile',() => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('success on modul with different named function',() => {
        loadModule.mockResolvedValue({
            validate_doc_update:function map(){}
        });
        //fs.readFile.mockResolvedValue('content of regular file');
        return createDesignSectionFromFile('./root','validate_doc_update.js').then(result => {
            expect(result).toStrictEqual({validate_doc_update:{map:'function () {}'}});
        });
    });

    test('success on modul with same named function',() => {
        loadModule.mockResolvedValue({
            validate_doc_update:function validate_doc_update(){}
        });
        //fs.readFile.mockResolvedValue('content of regular file');
        return createDesignSectionFromFile('./root','validate_doc_update.js').then(result => {
            expect(result).toStrictEqual({validate_doc_update:'function () {}'});
        });
    });

    test('success on json file',() => {
        fs.readFile.mockResolvedValue('{"helo":"json"}');
        return createDesignSectionFromFile('./root','validate_doc_update.json').then(result => {
            expect(result).toStrictEqual({validate_doc_update:{helo:'json'}});
            expect(fs.readFile.mock.calls.length).toBe(1);
            expect(fs.readFile.mock.calls[0][0]).toBe('root/validate_doc_update.json');
        });
    });


    test('fail on fileread', () => {
        expect.assertions(1);
        //fs.readFile.mockRejectedValue({message:'reading error'});
        loadModule.mockRejectedValue({message:'module loading error'});
        return createDesignSectionFromFile('./root','validate_doc_update.js').catch(error => {
            expect(error).toBe('Can\'t load module from root/validate_doc_update.js! module loading error');
           // expect(fs.readFile.mock.calls.length).toBe(0);
        });
    });

    test('fail on bad json', () => {
        fs.readFile.mockResolvedValue('{helo:"json",}');
        return createDesignSectionFromFile('./root','options.json').catch(error => {
            expect(error).toMatch(/^Bad content in root\/options.json. It must be valid json!.{0,}/);
        });
    });

});
