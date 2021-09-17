import path from 'path';



export default function extractFileStats(directory, fileName){
    let fileParts = fileName.split('.');
    let isJSON = fileParts[fileParts.length - 1].toLowerCase() === 'json';
    let isJavaScript = fileParts[fileParts.length - 1].toLowerCase() === 'js';
    let isLib = false;
    let name = fileParts[0];
    let filePath = path.join(directory, fileName);
    if(!isJSON && fileParts.length === 3) isLib = true;
    return { isJSON, isLib, name, filePath, isJavaScript}
}