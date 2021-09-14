import createSection from '../src/createSection';
import fs from 'fs/promises';

jest.mock('fs/promises');


 describe('createSection',() => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('success on file',() => {
        fs.stat.mockResolvedValue({isFile:() => true,isDirectory:() => false});
        fs.readFile.mockResolvedValue('content of regular file');
        return createSection('./root','validate_doc_update.js').then(result => {
            expect(result).toStrictEqual({validate_doc_update:'content of regular file'});
            expect(fs.readFile.mock.calls.length).toBe(1);
            expect(fs.readFile.mock.calls[0][0]).toBe('root/validate_doc_update.js');
        });
    });


    test('success on directory',() => {
        fs.stat.mockResolvedValueOnce({isFile:() => false,isDirectory:() => true});
        fs.stat.mockResolvedValue({isFile:() => true,isDirectory:() => false});
        fs.readdir.mockResolvedValue(['egy.js','kettő.js']);
        fs.readFile.mockImplementation(name => Promise.resolve(`content of ${name}`));
        return createSection('design/root','shows').then(result => {
            expect(result).toMatchSnapshot();
            expect(fs.readFile.mock.calls.length).toBe(2);
        });
    });

    test('fail on not exist',() => {
        fs.stat.mockRejectedValue('no such file or directory');
        return createSection('./root','flie').catch(err => {
            expect(err).toBe('no such file or directory');
            expect(fs.readFile).not.toHaveBeenCalled();
        });
    });

    test('fail on not file or directory', ()=> {
        fs.stat.mockResolvedValue({isFile:() => false,isDirectory:() => false});
        return createSection('./root','flie').catch(err => {
            expect(err).toBe('Bad structure! root/flie must be file or directory!');
            expect(fs.readFile).not.toHaveBeenCalled();
        });
    });
});