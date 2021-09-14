import designer from '../src/designer';



describe('designer_edge',() => {
    test('success edge test',() => {
        return designer('./tests/design').then(result => {
            expect(result).toMatchSnapshot();
        });
    });
   
});