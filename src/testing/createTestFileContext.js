import testStatSupplement from './testStatSupplement';
import createTestContextModule from './createTestContextModule';
import creteTestSectionFromModule from './createTestSectionFromModule';



const createTestFileContext = (oldStats, fileStat, testContextName) => {
    return new Promise((resolve, reject) => {
        testStatSupplement(oldStats,fileStat).then(fileStats => {
            if(fileStats.isModified){
                createTestContextModule(fileStats, testContextName).then(() => {
                    creteTestSectionFromModule(fileStats).then(resolve, reject);
                },reject);
            }else{
                creteTestSectionFromModule(fileStats).then(resolve, reject);
            }
        },err => reject(err));
    });
}

export default createTestFileContext;