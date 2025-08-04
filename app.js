const { writeFiles } = require('./helpers/readFile');
const { readFile } = require('./helpers/readFile');
const http = require('http');
const url = require('url');
const path = require('path');



const server = http.createServer(async (req,res) => {
    if (req.url === '/' && req.method === 'GET') {
        const html = await readFile('pages','index.html')
        writeFiles(res,200,html,'text/html');
        
    } else if (req.url === '/api/users' && req.method === 'GET') {
        const users = await readFile('db','users.json')
        writeFiles(res,200,users,'application/json');
    
    } else if (req.url.match(/\api\/users\/([0-9]+)/) && req.method === 'GET') {
        const usersJSON = await readFile('db', 'users.json');
        const users = JSON.parse(usersJSON);
        const id = path.basename(req.url);
        console.log(path.basename(req.url).split('='));
        
        // const parsedUrl = url.parse(req.url, true);
        // const id = parsedUrl.pathname.split('/')[3];
        
        const user = users.find(u => u.id === id);

    if (user) {
      writeFiles(res,200,JSON.stringify(user),'application/json')
    } else {
      writeFiles(res,404,JSON.stringify({ message: 'User not found' }),'application/json')
    }
    } else if (req.url.match(/\/api\/users\?name=([a-zA-Z]+)/) && req.method === "GET") {
        const users = JSON.parse(await readFile('db', 'users.json'))
        const query = path.basename(req.url).split('=');
        const name = query[1]
        

        const usersName = users.filter(user => user.name === name)
        
        writeFiles(res,200,JSON.stringify(usersName), res)
    }
     else {
        const html = await readFile('pages', 'error.html')
        writeFiles(res,404,html,'text/html');
    }
})

.listen(3001, () => {console.log('Server is Runing...')})