const { writeFiles, error404, putObj } = require('./helpers/readFile');
const { readFile } = require('./helpers/readFile');
const http = require('http');
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
    } else if (req.url.match(/^\/api\/users\?age=([0-9a-zA-Z]+)$/) && req.method === 'GET') {
        const users = await JSON.parse(await readFile('db', 'users.json'))
        const query = path.basename(req.url).split('=');
        const age = query[1]        
        let sortedAge = [...users]

        if (age === 'min') {
            sortedAge = sortedAge.toSorted((a,b) => a.age - b.age)
        } else if (age === 'max') {
            sortedAge = sortedAge.toSorted((a,b) => b.age - a.age)
        } else {
            writeFiles(res, 404, JSON.stringify({message:'Not allow'}),'application/json')
        }
        writeFiles(res,200,JSON.stringify(sortedAge),'application/json')
    } else if (req.url === '/api/users' && req.method === "POST") {
        req.on('data', async (chunk) => {
            let body = JSON.parse(chunk.toString());
            body.id = Date.now()
            const users = await JSON.parse(await readFile('db', 'users.json'))
            const user = users.find((e) => e.email === body.email)
            if (user) {
                writeFiles(res, 200, JSON.stringify({message:`Email -> ${body.email} is already exist`}),'application/json')
            } else {
                users.push(body)
                fs.unlink(path.join(__dirname, 'db', 'users.json'), (err) => { console.log(err) });
                fs.appendFile(path.join(__dirname, 'db', 'users.json'), JSON.stringify(users));
                res.end(JSON.stringify(users))
            }
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
            await fs.unlink(path.join(__dirname, 'db', 'users.json'), (err) => { console.log(err) });
            fs.appendFile(path.join(__dirname, 'db', 'users.json'), JSON.stringify(users))
            res.end(JSON.stringify(users))
        })
    } else if (req.url.match(/^\/api\/users\/([0-9]+)$/) && req.method === "PUT") {
        const id = path.basename(req.url);
        req.on('data', async (chunk) => {
            let body = JSON.parse(chunk.toString());
            const users = await JSON.parse(await readFile('db', 'users.json'))
            const findedUser = users.findIndex((e) => e.id === id)

            if (!findedUser) {
                users.push(body)
                putObj(users,'db','users.json',res)
            } else {
                // Object.assign(findedUser,body)
                users[findedUser] = body
                putObj(users,'db','users.json',res)
            }
            
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