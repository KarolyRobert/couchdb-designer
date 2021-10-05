import path from 'path';

export default function loadModule(directory,name){

    return new Promise((resolve,reject) => {
        let jsModule = false;
        try{
            if(process.env.JEST_WORKER_ID){
                jest.useFakeTimers();
            }
            jsModule = require(path.resolve(process.env.PWD,directory,name));
         
            if(Object.keys(jsModule).length > 0){
                resolve(jsModule);
            }else{
                reject(new Error(`The module ${path.join(directory,name)} doesn't export anything! You must export function/s with module.exports = {...}`));
            }
        }catch(err){
           
            reject(err);
        }
    })
}