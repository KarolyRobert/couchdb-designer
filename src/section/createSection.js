import path from 'path';
import fs from 'fs/promises';
import createDesignSectionFromFile from './createDesignSectionFromFile';
import createTestSectionFromFile from '../testing/createTestSectionFromFile';
import createSectionFromDirectory from './createSectionFromDirectory';


const createSection = (directory, name, testContextName, signal = {aborted: false}) => {
    if(!signal.aborted){
        return new Promise((resolve, reject) => {
            let sectionPath = path.join(directory,name);
            fs.stat(sectionPath).then(fileStat => {
                if(fileStat.isFile() || fileStat.isDirectory()){
                    if(fileStat.isFile()){
                        if(testContextName){
                            createTestSectionFromFile(directory, name, fileStat, testContextName, signal).then(resolve,reject);
                        }else{
                            createDesignSectionFromFile(directory, name).then(resolve,reject);
                        }
                    }else{
                        createSectionFromDirectory( directory, name, testContextName, signal ).then(resolve,reject);
                    }
                }else{
                    reject(`Bad structure! ${sectionPath} must be file or directory!`);
                }
            },err => reject(err));
        });
    }
}

export default createSection;