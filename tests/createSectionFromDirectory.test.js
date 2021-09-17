import fs from 'fs/promises';
import createSection from '../src/section/createSection';
import createSectionFromDirectory from '../src/section/createSectionFromDirectory';


jest.mock('fs/promises');
jest.mock('../src/section/createSection');

describe('createDeisgnDocument',() => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('success',() => {
        fs.readdir.mockResolvedValue(['foo','bar','baz']);
        createSection.mockResolvedValueOnce({foo:"bar"});
        createSection.mockResolvedValueOnce({bar:"baz"});
        createSection.mockResolvedValueOnce({baz:"foo"});
        return createSectionFromDirectory('root','name').then(result => {
            expect(result).toEqual({name:{foo:"bar",bar:"baz",baz:"foo"}});
        });
    });

    test('reject on not directory',() => {
        fs.readdir.mockRejectedValue({message:'not a dir'});
        return createSectionFromDirectory('root','name').catch(result => {
            expect(result).toBe('Bad structure! root/name must be a directory! not a dir');
        });
    });
    test('reject on createSection',() => {
        fs.readdir.mockResolvedValue(['foo','bar','baz']);
        createSection.mockRejectedValue('pass this error');
        return createSectionFromDirectory('root','name').catch(result => {
            expect(result).toBe('pass this error');
        });
    });
});