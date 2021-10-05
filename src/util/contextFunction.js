import testBuiltIns from '../testing/testBuiltIns';



const contextFunction = (contextId) => {
    return (need,params) => {
        if(need in testBuiltIns){
            return testBuiltIns[need](contextId,params);
        }else{
            throw(`${need} is not supported! The list of available opportunities is in README.md`);
        }
    }
}

export default contextFunction;