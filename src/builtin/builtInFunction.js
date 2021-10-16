const createMock = (calls,mockFunction) => {
    return (...args) => {
       calls.push(args);
       if(typeof mockFunction === 'function'){
           mockFunction(...args);
       }
   }
}


const builtInFunction = mockFunction => {
   const calls = [];
   let mockFn = createMock(calls,mockFunction);
   const mockImplementation = newMockFn => {
       mockFn = createMock(calls,newMockFn);
   }
   const mockClear = () => {
     calls.splice(0,calls.length);
   }
   const mock = (...args) => {
       return mockFn(...args);
   }
   return Object.assign(mock,{mockImplementation,mockClear,mock:{calls}});
}

export default builtInFunction;