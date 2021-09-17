const contexts = {}

const registerContext = (testContext,testContextName) => {
    contexts[testContextName] = testContext;
}


module.exports = { registerContext };