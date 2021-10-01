import path from 'path';
import fs from 'fs/promises';


export default function loadTestModule(fileStats){

    return new Promise((resolve,reject) => {
        try{
            //console.log(fileStats);
            let modulePath = path.resolve(__dirname,fileStats.testModule);
            const jsModule = require(path.resolve(__dirname,fileStats.testModule));
            if(Object.keys(jsModule).length > 0){
                resolve(jsModule);
            }else{                
                fs.rm(fileStats.testPath,{force:true,maxRetries:10}).then(() => {
                    reject(new Error(`The module ${fileStats.filePath} does not exist't export anything! You must export function/s with module.exports = {...}`));
                },err => reject(err));
            }
        }catch(err){
            reject(err);
        }
    })
}