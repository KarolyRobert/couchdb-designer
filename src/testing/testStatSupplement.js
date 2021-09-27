import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';


const testStatSupplement = (oldStats,fileStat) => {
    return new Promise((resolve, reject) => {
        let fileHash = crypto.createHash('md5').update(oldStats.filePath).digest("hex");
        let tempDirectory = '../../temp';
        let fileStats = {
            ...oldStats,
            testPath: path.resolve(__dirname,'../../temp',`${fileHash}.js`),
            testModule:path.join(tempDirectory,fileHash),
            isModified: true,
        }
        fs.stat(fileStats.testPath).then(moduleStat => {
            if(fileStat.mtimeMs < moduleStat.mtimeMs) {
                fileStats.isModified = false;
            }
            resolve(fileStats);
        },err => {
            if(err.code === 'ENOENT') {
                resolve(fileStats);
            }else{
                reject(err);
            }
        });
    });
}

export default testStatSupplement;