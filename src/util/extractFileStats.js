import path from 'path';



export default function extractFileStats(directory, fileName, root){
    let fileParts = fileName.split('.');
    let isJSON = fileParts[fileParts.length - 1].toLowerCase() === 'json';
    let isJavaScript = fileParts[fileParts.length - 1].toLowerCase() === 'js';
    let isLib = false;
    let name = fileParts[0];
    let typePath = false;
    if(root){
        typePath = path.join(directory, name).split(root)[1].split(path.sep);
        typePath.shift();
    }
    let filePath = path.join(directory, fileName);
    if(isJavaScript && fileParts[fileParts.length - 2] === 'lib') isLib = true;

    return { isJSON, isLib, name, typePath, filePath, isJavaScript}
}