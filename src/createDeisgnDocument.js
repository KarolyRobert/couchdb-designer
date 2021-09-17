import createSectionFromDirectory from './section/createSectionFromDirectory';


export default function createDesignDocument(root,name){
    return new Promise((resolve,reject) => {
        let designDocument = {
            _id:`_design/${name}`
        };
        designDocument.language = 'javascript';

        createSectionFromDirectory(root,name).then(section => {
            resolve(Object.assign(designDocument,section[name]));
        },err => reject(err));        
    });
}