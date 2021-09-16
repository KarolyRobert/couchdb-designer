import path from 'path';
import fs from 'fs/promises';
import createSection from './createSection';


const createSectionFromDirectory = (directory, sectionName) => {
    return new Promise((resolve, reject) => {
        let directoryPath = path.join(directory,sectionName);
        fs.readdir(directoryPath).then(names => {
            Promise.all(names.map(name => {
              
                    return createSection(directoryPath,name);
                
                })).then(sections => {
                    let directorySection = {};
                    for(let section of sections) {
                        if(directorySection.hasOwnProperty(Object.keys(section)[0])){
                            let sectionKey = Object.keys(section)[0];
                            directorySection[sectionKey] = Object.assign(directorySection[sectionKey],section[sectionKey]);
                        }else{
                            directorySection = Object.assign(directorySection,section);
                        }
                    }
                    resolve({[sectionName]:directorySection});
            },err => reject(err));
        },err => reject(`Bad structure! ${directoryPath} must be a directory! ${err.message}`));
    });
}

export default createSectionFromDirectory;