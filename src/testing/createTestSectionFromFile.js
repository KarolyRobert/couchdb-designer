import fs from 'fs/promises';
import extractFileStats from '../util/extractFileStats';
import createTestFileContext from './createTestFileContext';

const creteTestSectionFromFile = (directory, fileName, fileStat, testContextName) => {

    return new Promise((resolve,reject) => {
        let fileStats = extractFileStats(directory, fileName);
        if(fileStats.isJSON){
            fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
                let jsonObject = JSON.parse(content.trim());
                resolve({[fileStats.name]:jsonObject});
            },err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
        }else{
            createTestFileContext(fileStats, fileStat, testContextName).then(resolve,reject);
        }

        /*  
        fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
            if(fileStats.isJSON){
                try{
                    let jsonObject = JSON.parse(content.trim());
                    resolve({[fileStats.name]:jsonObject});
                }catch(err){
                    reject(`Bad content in ${fileStats.filePath}. It must be valid json! ${err.message}`);
                }
            }else{
                createTestFileContext(fileStats,content).then(resolve,reject);
            }
        },err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
        */
    });
}

export default creteTestSectionFromFile;