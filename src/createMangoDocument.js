import fs from 'fs/promises';
import path from 'path';
import mangoFields from './util/mangoFields';
import compileSelector from './util/compileSelector';


const createMangoDocument = (root,name) => {
    return new Promise((resolve, reject) => {
        let ddoc = {
            _id:`_design/${name.split('.')[0]}`,
            language:'query',
            views:{}
        }
        let file = path.join(root,name);
        fs.readFile(file).then(fileContent => {
            try{
                let json = JSON.parse(fileContent);
                let keys = Object.keys(json);
                for(let key of keys) {
                    if(key === 'partitioned'){
                        if(json.partitioned){
                            ddoc.options = { partitioned: true }
                        }else{
                            ddoc.options = { partitioned: false }
                        }
                    }else{
                        let view = { 
                            map:{
                                fields: mangoFields(json[key].fields,file,key),
                                partial_filter_selector: json[key].partial_filter_selector ? compileSelector(json[key].partial_filter_selector,file,key) : {}
                            },
                            reduce:'_count',
                            options: { 
                                def: json[key]
                            }
                        }
                        ddoc.views[key] = view;
                    }
                }
                resolve(ddoc);
            }catch(err){
                reject(err);
            }
        },reject);
    })
}

export default createMangoDocument;