const { writeFiles, error404 } = require('./helpers/readFile');
const { readFile } = require('./helpers/readFile');
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs').promises




const server = http.createServer(async (req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        const html = await readFile('pages', 'index.html')
        writeFiles(res, 200, html, 'text/html');

    } else if (req.url === '/api/users' && req.method === 'GET') {
        const users = await readFile('db', 'users.json')
        writeFiles(res, 200, users, 'application/json');

    } else if (req.url.match(/^\/api\/users\/([0-9]+)$/) && req.method === 'GET') {
        const usersJSON = await readFile('db', 'users.json');
        const users = JSON.parse(usersJSON);
        const id = path.basename(req.url);
        console.log(path.basename(req.url).split('='));

        // const parsedUrl = url.parse(req.url, true);
        // const id = parsedUrl.pathname.split('/')[3];

        const user = users.find(u => u.id === id);

        if (user) {
            writeFiles(res, 200, JSON.stringify(user), 'application/json')
        } else {
            writeFiles(res, 404, JSON.stringify({ message: 'User not found' }), 'application/json')
        }
    } else if (req.url.match(/\/api\/users\?name=([a-zA-Z]+)/) && req.method === "GET") {
        const users = JSON.parse(await readFile('db', 'users.json'))
        const query = path.basename(req.url).split('=');
        const name = query[1]
        const usersName = users.filter(user => user.name.toLowerCase().indexOf(name.toLowerCase()) > -1);


        writeFiles(res, 200, JSON.stringify(usersName), res)
    } else if (req.url === '/api/users' && req.method === "POST") {
        req.on('data', async (chunk) => {
            let body = JSON.parse(chunk.toString());
            body.id = Date.now()
            const users = await JSON.parse(await readFile('db', 'users.json'))
            users.push(body)
            fs.unlink(path.join(__dirname, 'db', 'users.json'), (err) => { console.log(err) });
            fs.appendFile(path.join(__dirname, 'db', 'users.json'), JSON.stringify(users));
            res.end(JSON.stringify(users))
        });
    } else if (req.url.match(/^\/api\/users\/([0-9]+)$/) && req.method === "PATCH") {
        const id = path.basename(req.url);
        req.on('data', async (chunk) => {
            let body = JSON.parse(chunk.toString());
            const users = await JSON.parse(await readFile('db', 'users.json'))
            const findedUser = users.find((e) => e.id === id)
            if (!findedUser) {
                error404(res)
                return;
            }
            findedUser.name = body.name
            fs.unlink(path.join(__dirname, 'db', 'users.json'), (err) => { console.log(err) });
            fs.appendFile(path.join(__dirname, 'db', 'users.json'), JSON.stringify(users))
            res.end(JSON.stringify(users))
        })
    } else if (req.url.match(/^\/api\/users\/([0-9]+)$/) && req.method === "DELETE") {

        let users = await JSON.parse(await readFile('db', 'users.json'))
        const user = users.find((e) => e.id === path.basename(req.url));
        console.log(user);

        if (!user) {
            error404(res)
            return;
        }

        users = users.filter((e) => e.id != user.id);
            fs.unlink(path.join(__dirname, 'db', 'users.json'), (err) => { console.log(err) });
            fs.appendFile(path.join(__dirname, 'db', 'users.json'), JSON.stringify(users))
            res.end(JSON.stringify(users))
    }
    else {
        error404(res)
    }
})

    .listen(3000, () => { console.log('Server is Runing...') })