import testStatSupplement from './testStatSupplement';
import createTestContextModule from './createTestContextModule';
import creteTestSectionFromModule from './createTestSectionFromModule';



const createTestFileContext = (oldStats, fileStat, contextName, signal) => {
    if(!signal.aborted) {
        return new Promise((resolve, reject) => {
            testStatSupplement(oldStats,fileStat).then(fileStats => {
                if(fileStats.isModified){
                    createTestContextModule(fileStats, contextName, signal).then(() => {
                    
                        creteTestSectionFromModule(fileStats, contextName).then(resolve, reject);
                    },reject);
                }else{
                    creteTestSectionFromModule(fileStats, contextName).then(resolve, reject);
                }
            },err => reject(err));
        });
    }
}

export default createTestFileContext;