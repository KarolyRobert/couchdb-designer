import path from 'path';
import fs from 'fs/promises';
import createSectionFromFile from './createSectionFromFile';
import createSectionFromDirectory from './createSectionFromDirectory';

const createSection = (directory, name ) => {
    return new Promise((resolve, reject) => {
        let sectionPath = path.join(directory,name);
        fs.stat(sectionPath).then(stat => {
            if(stat.isFile() || stat.isDirectory()){
                if(stat.isFile()){
                    createSectionFromFile( directory, name ).then(result => resolve(result)
                    ,err => reject(err));
                }else{
                    createSectionFromDirectory( directory, name ).then(result => resolve(result)
                    ,err => reject(err));
                }
            }else{
                reject(`Bad structure! ${sectionPath} must be file or directory!`);
            }
        },err => reject(err));
    });
}

export default createSection;