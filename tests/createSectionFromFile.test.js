import createSectionFromFile from '../src/createSectionFromFile';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('createSectionFromFile',() => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('success on regular file',() => {
        fs.readFile.mockResolvedValue('content of regular file');
        return createSectionFromFile('./root','validate_doc_update.js').then(result => {
            expect(result).toStrictEqual({validate_doc_update:'content of regular file'});
            expect(fs.readFile.mock.calls.length).toBe(1);
            expect(fs.readFile.mock.calls[0][0]).toBe('root/validate_doc_update.js');
        });
    });

    test('success on json file',() => {
        fs.readFile.mockResolvedValue('{"helo":"json"}');
        return createSectionFromFile('./root','validate_doc_update.json',true).then(result => {
            expect(result).toStrictEqual({validate_doc_update:{helo:'json'}});
            expect(fs.readFile.mock.calls.length).toBe(1);
            expect(fs.readFile.mock.calls[0][0]).toBe('root/validate_doc_update.json');
        });
    });


    test('fail on fileread', () => {
        fs.readFile.mockRejectedValue({message:'reading error'});
        return createSectionFromFile('./root','validate_doc_update.js').catch(error => {
            expect(error).toBe('Bad structure! root/validate_doc_update.js must be regular file! reading error');
        });
    });

    test('fail on bad json', () => {
        fs.readFile.mockResolvedValue('{helo:"json",}');
        return createSectionFromFile('./root','validate_doc_update.js',true).catch(error => {
            expect(error).toMatch(/^Bad content in root\/validate_doc_update.js. It must be valid json!*/);
        });
    });

});
