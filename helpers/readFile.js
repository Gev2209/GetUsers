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
    return res
}

const error404 = async (res) => {
    const html = await readFile('pages', 'error.html');
    writeFiles(res, 404, html, 'text/html');
}
module.exports = {
    readFile,
    writeFiles,
    error404
}