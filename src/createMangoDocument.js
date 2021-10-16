import fs from 'fs/promises';
import path from 'path';

const mapFields = (fields,fileName,indexName) => {
    let fieldsObject = {};
    let direction = false;
    for(let field of fields) {
        if(typeof field === 'string'){
            if(direction && direction !== 'asc'){
                throw(`(unsupported_mixed_sort) Sorts currently only support a single direction for all fields. You can fix it in ${fileName} - index: ${indexName}.`);
            }else if(!direction){
                direction = 'asc';
            }
            fieldsObject[field] = direction;
        }else if(typeof field === 'object'){
            let fieldName = Object.keys(field);
            if(fieldName.length === 1 && (field[fieldName[0]] === 'asc' || field[fieldName[0]] === 'desc')){
                if(direction && direction !== field[fieldName[0]]){
                    throw(`(unsupported_mixed_sort) Sorts currently only support a single direction for all fields. You can fix it in ${fileName} - index: ${indexName}.`);
                }else if(!direction){
                    direction = field[fieldName[0]];
                }
                fieldsObject[fieldName[0]] = direction;
            }else{
                throw(`(invalid_sort_field) Invalid sort field: ${fieldName[0]}:${field[fieldName[0]]}. You can fix it in ${fileName},${indexName} index.`);
            }
        }else{
            throw(`(invalid_sort_field) Invalid sort field: ${field}. You can fix it in ${fileName},${indexName} index.`);
        }
    }
    return fieldsObject;
}


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
                                fields: mapFields(json[key].fields,file,key),
                                partial_filter_selector: json[key].partial_filter_selector ? json[key].partial_filter_selector : {}
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