import designer from '../src/designer';



describe('designer_edge',() => {
    test('success edge test',() => {
        return designer('./tests/design').then(result => {
            expect(result).toMatchSnapshot();
        });
    });
    test('stringifyed',() => {
        return designer('./tests/design').then(result => {
            expect(JSON.stringify(result,null,3)).toMatchSnapshot();
        })
    })
   
});