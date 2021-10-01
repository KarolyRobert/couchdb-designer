import fs from 'fs/promises';
import extractFileStats from '../util/extractFileStats';
import createTestFileContext from './createTestFileContext';

const creteTestSectionFromFile = (directory, fileName, fileStat, contextProps, signal) => {
    if(!signal.aborted){
        return new Promise((resolve,reject) => {
            let fileStats = extractFileStats(directory, fileName, contextProps);
            if(!fileStats.isJavaScript){
                fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
                    if(fileStats.isJSON){
                        try{
                            let jsonObject = JSON.parse(content.trim());
                            resolve({[fileStats.name]:jsonObject});
                        }catch (err) {
                            reject(`Bad JSON format in ${fileStats.filePath}! ${err.message}`);
                        }
                    }else{
                        resolve({[fileStats.name]:content.trim()});
                    }
                },err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
            }else{
                createTestFileContext(fileStats, fileStat, contextProps, signal).then(resolve,reject);//testFileContext =>  resolve(testFileContext),err => reject(err));
            }
        });
    }
}

export default creteTestSectionFromFile;