import fs from 'fs/promises';
import path from 'path';


const createTestContextModule = (fileStats,testContextName, signal) => {
    if(!signal.aborted) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileStats.filePath,{encoding:'utf8'}).then(content => {
                let moduleContent = `const environment = require('../build/testing/testEnvironment').testEnvironment("${testContextName}");\n`+
                    'require = environment.require;\n'+
                    'const emit = environment.emit;\n'+
                    'const log = environment.log;\n'+
                    'const isArray = Array.isArray;\n'+
                    'const sum = environment.sum;\n'+
                    'const toJSON = environment.toJSON;\n'+
                    `//original\n${content}`;
                
                fs.writeFile(path.resolve(__dirname,fileStats.testPath),moduleContent,{signal}).then(resolve, reject);
            
            },err => reject(err));
        });
    }
}

export default createTestContextModule;