


export default function loadTestModule(fileStats){

    return new Promise(async (resolve,reject) => {
        let jsModule = false;
        try{
            jsModule = require(fileStats.modulePath);
            if(Object.keys(jsModule).length > 0){
                resolve(jsModule);
            }else{
                reject(new Error(`The module ${fileStats.filePath} doesn't export anything! You must export function/s with module.exports = {...}`));
            }
        }catch(err){
            reject(err);
        }
    })
}