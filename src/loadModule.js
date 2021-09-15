import path from 'path';

export default function loadModule(directory,name){

    return new Promise((resolve,reject) => {
        let jsModule;
        try{
            jsModule = require(path.resolve(process.env.PWD,directory,name));
            resolve(jsModule);
        }catch(err){
            reject(err);
        }
    })
}