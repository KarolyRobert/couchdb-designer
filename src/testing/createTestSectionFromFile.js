import fs from 'fs/promises';
import extractFileStats from '../util/extractFileStats';
import createTestFileContext from './createTestFileContext';

const creteTestSectionFromFile = (directory, fileName, fileStat, contextName, signal) => {
    if(!signal.aborted){
        return new Promise((resolve,reject) => {
            let fileStats = extractFileStats(directory, fileName);
            if(fileStats.isJSON){
                fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
                    try{
                        let jsonObject = JSON.parse(content.trim());
                        resolve({[fileStats.name]:jsonObject});
                    }catch (err) {
                        reject(`Bad JSON format in ${fileStats.filePath}! ${err.message}`);
                    }
                },err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
            }else{
                createTestFileContext(fileStats, fileStat, contextName, signal).then(resolve,reject);//testFileContext =>  resolve(testFileContext),err => reject(err));
            }
        });
    }
}

export default creteTestSectionFromFile;