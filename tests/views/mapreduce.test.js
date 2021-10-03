import createTestContext from '../../src/createTestContext';


const reduceDatabase = [
    {_id:'doc0',date:1632601214703,value:{object:[0,1],value:{field:0}}},
    {_id:'doc1',date:1632457214703,value:{object:[1,1],value:{field:1}}},
    {_id:'doc2',date:1632313214703,value:{object:[2,1],value:{field:2}}},
    {_id:'doc3',date:1632169214703,value:{object:[3,1],value:{field:3}}},
    {_id:'doc4',date:1632025214703,value:{object:[4,1],value:{field:4}}},
    {_id:'doc5',date:1631881214703,value:{object:[5,1],value:{field:5}}},
    {_id:'doc6',date:1631737214703,value:{object:[6,1],value:{field:6}}},
    {_id:'doc7',date:1631593214703,value:{object:[7,1],value:{field:7}}},
    {_id:'doc8',date:1631449214703,value:{object:[8,1],value:{field:8}}},
    {_id:'doc9',date:1631305214703,value:{object:[9,1],value:{field:9}}},
    {_id:'doc10',date:1631161214703,value:{object:[10,1],value:{field:10}}},
    {_id:'doc11',date:1631017214703,value:{object:[11,1],value:{field:11}}},
    {_id:'doc12',date:1630873214703,value:{object:[12,1],value:{field:12}}},
    {_id:'doc13',date:1630729214703,value:{object:[13,1],value:{field:13}}},
    {_id:'doc14',date:1630585214703,value:{object:[14,1],value:{field:14}}},
    {_id:'doc15',date:1630441214703,value:{object:[15,1],value:{field:15}}},
    {_id:'doc16',date:1630297214703,value:{object:[16,1],value:{field:16}}},
    {_id:'doc17',date:1630153214703,value:{object:[17,1],value:{field:17}}},
    {_id:'doc18',date:1630009214703,value:{object:[18,1],value:{field:18}}},
    {_id:'doc19',date:1629865214703,value:{object:[19,1],value:{field:19}}},
    {_id:'doc20',date:1629721214703,value:{object:[20,1],value:{field:20}}},
    {_id:'doc21',date:1629577214703,value:{object:[21,1],value:{field:21}}},
    {_id:'doc22',date:1629433214703,value:{object:[22,1],value:{field:22}}},
    {_id:'doc23',date:1629289214703,value:{object:[23,1],value:{field:23}}},
    {_id:'doc24',date:1629145214703,value:{object:[24,1],value:{field:24}}},
    {_id:'doc25',date:1629001214703,value:{object:[25,1],value:{field:25}}},
    {_id:'doc26',date:1628857214703,value:{object:[26,1],value:{field:26}}},
    {_id:'doc27',date:1628713214703,value:{object:[27,1],value:{field:27}}},
    {_id:'doc28',date:1628569214703,value:{object:[28,1],value:{field:28}}},
    {_id:'doc29',date:1628425214703,value:{object:[29,1],value:{field:29}}},
    {_id:'doc30',date:1628281214703,value:{object:[30,1],value:{field:30}}},
    {_id:'doc31',date:1628137214703,value:{object:[31,1],value:{field:31}}},
    {_id:'doc32',date:1627993214703,value:{object:[32,1],value:{field:32}}},
    {_id:'doc33',date:1627849214703,value:{object:[33,1],value:{field:33}}},
    {_id:'doc34',date:1627705214703,value:{object:[34,1],value:{field:34}}},
    {_id:'doc35',date:1627561214703,value:{object:[35,1],value:{field:35}}},
    {_id:'doc36',date:1627417214703,value:{object:[36,1],value:{field:36}}},
    {_id:'doc37',date:1627273214703,value:{object:[37,1],value:{field:37}}},
    {_id:'doc38',date:1627129214703,value:{object:[38,1],value:{field:38}}},
    {_id:'doc39',date:1626985214703,value:{object:[39,1],value:{field:39}}}
    ]


const reduceDatabase2 = [
    {_id:'doc40',date:1632601214703,value:{object:[0,1],value:{field:0}}},
    {_id:'doc41',date:1632457214703,value:{object:[1,1],value:{field:1}}},
    {_id:'doc42',date:1632313214703,value:{object:[2,1],value:{field:2}}},
    {_id:'doc43',date:1632169214703,value:{object:[3,1],value:{field:3}}},
    {_id:'doc44',date:1632025214703,value:{object:[4,1],value:{field:4}}},
   
    ]


describe('map/reduce',() => {

    test('reducer test',() => {
        return createTestContext('./tests/design/appdesign',reduceDatabase).then(context => {
            expect(context('server').view.byTest()).toEqual({rows:[{key:null,value:40}]});
        });
    });
    test('reducer test',() => {
        return createTestContext('./tests/design/appdesign',reduceDatabase2).then(context => {
            expect(context('server').view.byReducer({group_level:1})).toEqual({rows:[{key:[2021],value:5}]});
        });
    });
})