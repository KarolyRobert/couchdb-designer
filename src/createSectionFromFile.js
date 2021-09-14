import path from 'path';
import fs from 'fs/promises';


const createSectionFromFile = (directory, fileName ) => {
    return new Promise((resolve,reject) => {
        let filePath = path.join(directory,fileName);
        let sectionName = fileName.split('.')[0];
        let isJSON = (fileName.split('.').pop() === 'json');
            fs.readFile(filePath,{encoding:'utf8'}).then(content => {
                if(isJSON){
                    try{
                        let jsonObject = JSON.parse(content.trim());
                        resolve({[sectionName]:jsonObject});
                    }catch(err){
                        reject(`Bad content in ${filePath}. It must be valid json! ${err.message}`);
                    }
                }else{
                    resolve({[sectionName]:content.trim()});
                }
            },err => reject(`Bad structure! ${filePath} must be regular file! ${err.message}`));
    });
}

export default createSectionFromFile;