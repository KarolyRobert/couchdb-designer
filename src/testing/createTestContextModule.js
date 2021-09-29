import fs from 'fs/promises';
import path from 'path';

const createTestContextModule = (fileStats,contextName, signal) => {
    if(!signal.aborted) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
                let moduleContent = `const environment = require('../build/testing/testEnvironment').testEnvironment("${contextName}");\n`+
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
                if(fileStats.isLib){
                    moduleContent += 'const exports = module.exports;\n';
                }
                    moduleContent +=`//Original content \n${content}\n`;
                
                fs.writeFile(path.resolve(__dirname,fileStats.testPath),moduleContent,{signal}).then(resolve, reject);
            
            },err => reject(err));
        });
    }
}

export default createTestContextModule;