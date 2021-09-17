import createDeisgnDocument from '../src/createDeisgnDocument';
import createSectionFromDirectory from '../src/section/createSectionFromDirectory';

jest.mock('../src/section/createSectionFromDirectory');

describe('createDeisgnDocument',() => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('success',() => {
        createSectionFromDirectory.mockResolvedValue({ddoc:{views:{map:'fn'}}});
        return createDeisgnDocument('root','ddoc').then(result => {
            expect(result).toEqual({_id:'_design/ddoc',language:'javascript',views:{map:'fn'}});
        });
    });

    test('reject on not directory',() => {
        createSectionFromDirectory.mockRejectedValue('Bad structure!');
        return createDeisgnDocument('root','ddoc').catch(result => {
            expect(result).toBe('Bad structure!')
        });
    });
});