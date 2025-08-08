
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

// fetch('http://localhost:3000/api/users', {
//     method: "POST",
//     headers: {"content-type": 'application/json'},
//     body:JSON.stringify({name:"Srubi",email:"gveno@gmail.com"})
// }).then((res) => res.json()).then((res) => console.log(res))


// fetch('http://localhost:3000/api/users/1754504294503ll', {
//     method: "DELETE",
//     headers: {"content-type": 'application/json'}
// }).then((res) => res.json()).then((res) => console.log(res))

const arr = [{
        // "name": "Vaxinak",
        // "id": 1754508610936,
        "age":39
    },
    {
        // "name": "Srubi",
        // "email": "gveno@gmail.com",
        // "id": 1754657214796,
        "age":82
    }]

const sortArr = arr.toSorted((a,b) => a.age - b.age)
console.log(sortArr);
