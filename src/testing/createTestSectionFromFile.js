import fs from 'fs/promises';
import extractFileStats from '../util/extractFileStats';
import createTestJavascriptSection from './createTestJavascriptSection';

const creteTestSectionFromFile = (directory, fileName, contextProps) => {

    return new Promise((resolve,reject) => {
        let fileStats = extractFileStats(directory, fileName, contextProps);
       
        fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
            if(!fileStats.isJavaScript){
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
            }else{
                createTestJavascriptSection(fileStats, contextProps, content).then(resolve,reject);
            }
        },err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
    
    });    
}

export default creteTestSectionFromFile;