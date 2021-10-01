import testStatSupplement from './testStatSupplement';
import createTestContextModule from './createTestContextModule';
import creteTestSectionFromModule from './createTestSectionFromModule';



const createTestFileContext = (oldStats, fileStat, contextProps) => {

    return new Promise((resolve, reject) => {
        testStatSupplement(oldStats,fileStat).then(fileStats => {
            if(fileStats.isModified){
                createTestContextModule(fileStats, contextProps).then(() => {
                
                    creteTestSectionFromModule(fileStats, contextProps).then(resolve, reject);
                },reject);
            }else{
                creteTestSectionFromModule(fileStats, contextProps).then(resolve, reject);
            }
        },err => reject(err));
    });
    
}

export default createTestFileContext;