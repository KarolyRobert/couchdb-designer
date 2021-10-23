import {inspect} from 'util';


const mangoSort = sort => {
    let result = [];
    let direction = false;
    for(let field of sort){
        if(typeof field === 'string'){
            if(direction && direction !== 'asc'){
                throw('(unsupported_mixed_sort) Sorts currently only support a single direction for all fields!');
            }else if(!direction){
                direction = 'asc';
            }
            result.push({[field]:direction});
        }else if(typeof field === 'object'){
            let fieldName = Object.keys(field);
            if(fieldName.length === 1 && (field[fieldName[0]] === 'asc' || field[fieldName[0]] === 'desc')){
                if(direction && direction !== field[fieldName[0]]){
                    throw('(unsupported_mixed_sort) Sorts currently only support a single direction for all fields!');
                }else if(!direction){
                    direction = field[fieldName[0]];
                }
                result.push(field);
            }else{
                throw(`(invalid_sort_field) Invalid sort field: ${inspect(field)}!`);
            }
        }else{
            throw(`(invalid_sort_field) Invalid sort field: ${field}!`);
        }
    }
    return result;
}

export default mangoSort;