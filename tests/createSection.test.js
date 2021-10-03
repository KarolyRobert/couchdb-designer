import createSection from '../src/section/createSection';
import fs from 'fs/promises';
import loadModule from '../src/util/loadModule';

jest.mock('../src/util/loadModule');
jest.mock('fs/promises');


 describe('createSection',() => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('success on file',() => {
        fs.stat.mockResolvedValue({isFile:() => true,isDirectory:() => false});
        loadModule.mockResolvedValue({
            validate_doc_update:function validate_doc_update(doc,req){}
        });
        return createSection('./root','validate_doc_update.js').then(result => {
            expect(result).toStrictEqual({validate_doc_update:'function (doc, req) {}'});
        });
    });


    test('success on directory',() => {
        fs.stat.mockResolvedValueOnce({isFile:() => false,isDirectory:() => true});
        fs.stat.mockResolvedValue({isFile:() => true,isDirectory:() => false});
        fs.readdir.mockResolvedValue(['egy.js','kettő.js']);
        loadModule.mockResolvedValueOnce({egy:function egy(){}});
        loadModule.mockResolvedValueOnce({kettő:function kettő(doc){ emit(doc._id,1)}});
        return createSection('design/root','shows').then(result => {
            expect(result).toMatchSnapshot();
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