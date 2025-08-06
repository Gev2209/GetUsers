// const arr = [
//     {"name":"gevorg"},
//     {"name":"gergen"},
//     {"name":"grigor"},
//     {"name":"vahan"},
//     {"name":"siren"}
// ]

// let str = "ge"
// const getName = arr.filter(a => a.name.indexOf(str) > -1 || a.name.lastIndexOf(str) > -1);
// console.log(getName);


// const EvenEmitter = require('events');

// const eventsEmitter = new EvenEmitter()

// eventsEmitter.on('name', (chunk) => console.log(chunk))

// eventsEmitter.emit('name', 'Value')


// fetch('http://localhost:3000/api/users', {
//     method: "POST",
//     headers: {"content-type":'application/json'},
//     body: JSON.stringify({name:"Vaxinak"})
// }) .then((res) => res.json()).then((res) => console.log(res)) 

fetch('http://localhost:3000/api/users/4', {
    method: "PATCH",
    headers: {"content-type": 'application/json'},
    body:JSON.stringify({name:"Srubi"})
}).then((res) => res.json()).then((res) => console.log(res))


// fetch('http://localhost:3000/api/users/1754504294503ll', {
//     method: "DELETE",
//     headers: {"content-type": 'application/json'}
// }).then((res) => res.json()).then((res) => console.log(res))

