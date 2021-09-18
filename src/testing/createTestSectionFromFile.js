import fs from 'fs/promises';
import extractFileStats from '../util/extractFileStats';
import createTestFileContext from './createTestFileContext';

const creteTestSectionFromFile = (directory, fileName, fileStat, testContextName, signal) => {
    if(!signal.aborted){
        return new Promise((resolve,reject) => {
            let fileStats = extractFileStats(directory, fileName);
            if(fileStats.isJSON){
                fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
                    let jsonObject = JSON.parse(content.trim());
                    resolve({[fileStats.name]:jsonObject});
                },err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
            }else{
                createTestFileContext(fileStats, fileStat, testContextName, signal).then(context =>  resolve(context),err => reject(err));
            }
        });
    }
}

export default creteTestSectionFromFile;