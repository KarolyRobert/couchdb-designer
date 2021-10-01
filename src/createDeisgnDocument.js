import createSectionFromDirectory from './section/createSectionFromDirectory';
import path from 'path';


export default function createDesignDocument(root){
    return new Promise((resolve,reject) => {
        let name = root.split(path.sep).pop();
        let directory = path.join(root, '..');

        let designDocument = {
            _id:`_design/${name}`
        };
        designDocument.language = 'javascript';

        createSectionFromDirectory(directory,name).then(section => {
            resolve(Object.assign(designDocument,section[name]));
        },err => reject(err));        
    });
}