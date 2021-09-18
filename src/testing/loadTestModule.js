import path from 'path';


export default function loadTestModule(fileStats){

    return new Promise((resolve,reject) => {
        try{
            //console.log(fileStats);
            let modulePath = path.resolve(__dirname,fileStats.testModule);
            const jsModule = require(path.resolve(__dirname,fileStats.testModule));
            if(Object.keys(jsModule).length > 0){
                resolve(jsModule);
            }else{
                reject(new Error(`The module ${modulePath} does not exist't export anything! You must export function/s with module.exports = {...}`));
            }
        }catch(err){
            reject(err);
        }
    })
}