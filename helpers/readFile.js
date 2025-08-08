const fs = require('fs').promises;
const path = require('path');

const readFile = async (folder , file) => {
    const data = await fs.readFile(path.join(__dirname, '..', folder, file), 'utf-8')
    return data
}

const writeFiles = (res,status,writeObj,conType) => {
    res.writeHead(status, { 'content-type': conType});
    res.write(writeObj);
    res.end()
}

const error404 = async (res) => {
    const html = await readFile('pages', 'error.html');
    writeFiles(res, 404, html, 'text/html');
}

const putObj = async (obj,folder,file,res) => {
    await fs.unlink(path.join(__dirname, '..', folder, file), (err) => { console.log(err) });
    fs.appendFile(path.join(__dirname, '..', folder, file), JSON.stringify(obj))
    res.end(JSON.stringify(obj))
}
module.exports = {
    readFile,
    writeFiles,
    error404,
    putObj
}