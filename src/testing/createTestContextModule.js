import fs from 'fs/promises';
import path from 'path';

const createTestContextModule = (fileStats,contextProps) => {

    return new Promise((resolve, reject) => {
        fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
            let moduleContent = `const environment = require('../build/testing/testEnvironment').testEnvironment("${contextProps.contextId}");\n`+
                'require = environment.require;\n'+
                'const emit = environment.emit;\n'+
                'const log = environment.log;\n'+
                'const isArray = Array.isArray;\n'+
                'const sum = environment.sum;\n'+
                'const toJSON = JSON.stringify;\n'+
                'const getRow = environment.getRow;\n'+
                'const provides = environment.provides;\n'+
                'const registerType = environment.registerType;\n'+
                'const start = environment.start;\n'+
                'const send = environment.send;\n'+
                'const index = environment.index;\n';
                moduleContent +=`//Original content \n${content}\n`;
            let tempDirectory = path.join(__dirname, '../../temp');


            fs.stat(tempDirectory).then(tempStat => {
                if(tempStat.isDirectory()){
                    fs.writeFile(path.resolve(__dirname,fileStats.testPath),moduleContent).then(resolve, reject);
                }
            },err => {
                if(err.code === 'ENOENT'){
                    fs.mkdir(tempDirectory).then(() => {
                        fs.writeFile(path.resolve(__dirname,fileStats.testPath),moduleContent).then(resolve, reject);
                    },err => {
                        if(err.code === 'EEXIST'){
                            fs.writeFile(path.resolve(__dirname,fileStats.testPath),moduleContent).then(resolve, reject);
                        }else{
                            reject(err);
                        }
                    });
                }else{
                    reject(err);
                }
            })
            
        
        },err => reject(err));
    });
    
}

export default createTestContextModule;