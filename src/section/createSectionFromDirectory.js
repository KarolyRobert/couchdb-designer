import path from 'path';
import fs from 'fs/promises';
import createSection from './createSection';
import createTestViewFunction from '../testing/views/createTestViewFunction';


const createSectionFromDirectory = (directory, sectionName, contextName = false, signal = {aborted: false}) => {
    if(!signal.aborted){
        return new Promise((resolve, reject) => {
            let directoryPath = path.join(directory,sectionName);
            fs.readdir(directoryPath).then(names => {
            
                Promise.all(names.map(name => {

                        return createSection(directoryPath, name, contextName, signal );
                    
                    })).then(sections => {
                        let directorySection = {};
                        for(let section of sections) {
                            if(directorySection.hasOwnProperty(Object.keys(section)[0])){
                                let sectionKey = Object.keys(section)[0];
                                directorySection[sectionKey] = Object.assign(directorySection[sectionKey],section[sectionKey]);
                            }else{
                                if(contextName && sectionName === 'views'){
                                    let viewName = Object.keys(section)[0];
                                    let viewSection = {[viewName]:createTestViewFunction(contextName,viewName)};
                                    viewSection[viewName] = Object.assign(viewSection[viewName],section[viewName]);
                                    directorySection = Object.assign(directorySection,viewSection);
                                }else{
                                    directorySection = Object.assign(directorySection,section);
                                }
                            }
                        }
                        resolve({[sectionName]:directorySection});
                },err => reject(err));
            },err => reject(`Bad structure! ${directoryPath} must be a directory! ${err.message}`));
        });
    }
}

export default createSectionFromDirectory;