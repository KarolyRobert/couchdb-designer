import fs from 'fs/promises';
import loadModule from '../util/loadModule';
import extractFileStats from '../util/extractFileStats';

const nameRegexp = /^function\s{1,}(\S{1,})\s{0,}\(/


const createDesignSectionFromFile = (directory, fileName) => {
   
    return new Promise((resolve,reject) => {
        let fileStats = extractFileStats(directory, fileName);
        if(!fileStats.isJavaScript || fileStats.isLib){
            fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
                if(fileStats.isJSON){
                    try{
                        let jsonObject = JSON.parse(content.trim());
                        resolve({[fileStats.name]:jsonObject});
                    }catch(err){
                        reject(`Bad content in ${fileStats.filePath}. It must be valid json! ${err.message}`);
                    }
                }else{
                    resolve({[fileStats.name]:content.trim()});
                }
            },err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
        }else{
            loadModule(directory,fileStats.name).then(designModule => {
                let moduleKeys = Object.keys(designModule);
                if(moduleKeys.length === 1 && moduleKeys[0] === fileStats.name){
                    let functionString = designModule[moduleKeys[0]].toString();
                    let designFunction = functionString.replace(nameRegexp,'function (');
                    resolve({[fileStats.name]:designFunction});
                }else{
                    let moduleElementsObject = {}
                    moduleKeys.forEach(elementName => {
                        if(typeof designModule[elementName] === 'function'){
                            let functionString = designModule[elementName].toString();
                            let designFunction = functionString.replace(nameRegexp,'function (');
                            moduleElementsObject = Object.assign(moduleElementsObject,{[elementName]:designFunction});
                        }else{
                            moduleElementsObject = Object.assign(moduleElementsObject,{[elementName]:designModule[elementName]});
                        }
                    });
                    resolve({[fileStats.name]:moduleElementsObject});
                }

            },err => reject(`Can't load module from ${fileStats.filePath}! ${err.message}`));
        }
    });

    
}

export default createDesignSectionFromFile;