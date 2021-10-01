import testStatSupplement from './testStatSupplement';
import createTestContextModule from './createTestContextModule';
import creteTestSectionFromModule from './createTestSectionFromModule';



const createTestFileContext = (oldStats, fileStat, contextProps, signal) => {
    if(!signal.aborted) {
        return new Promise((resolve, reject) => {
            testStatSupplement(oldStats,fileStat).then(fileStats => {
                if(fileStats.isModified){
                    createTestContextModule(fileStats, contextProps, signal).then(() => {
                    
                        creteTestSectionFromModule(fileStats, contextProps).then(resolve, reject);
                    },reject);
                }else{
                    creteTestSectionFromModule(fileStats, contextProps).then(resolve, reject);
                }
            },err => reject(err));
        });
    }
}

export default createTestFileContext;