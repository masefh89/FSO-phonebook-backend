const express = require ("express");
const morgan = require("morgan")
const app = express();

let persons=[
    {
        id : "1",
        name : "Arto Hellas",
        number : "040-123456"
    },
    {
        id : "2",
        name : "Ada Lovelace",
        number : "39-44-5323523"
    },
    {
        id : "3",
        name : "Dan Abramov",
        number : "12-43-234245"
    },
    {
        id : "4",
        name : "Mary Poppendieck",
        number : "39-23-6423122"
    }
];
morgan.token("body", function (req,res){return JSON.stringify(req.body)})
morgan.token("theToken", function (tokens,req,res){
    return [
        tokens.method(req,res),
        tokens.url(req,res),
        tokens.status(req,res),
        tokens.res(res,res, "content-length"), "-",
        tokens["response-time"](req,res), "ms",
        tokens.body(req,res)
    ]
})
app.use(morgan("theToken"))
app.use(express.json());

app.get("/api/persons", (request , response)=>{
    return response.json(persons)
});
app.get("/info", (request, response)=>{
    const date = new Date()
    const info = (`<div>
    <h2>Phonebook has info for ${persons.length} people</h2>
    <h3>${date}</h3>
    </div>`)
    response.send(info)
})
app.get("/api/persons/:id", (request, response)=>{
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (!person){
        return response.status(404).end()
    }
    
    response.json(person)
    
})
app.delete("/api/persons/:id", (request, response) =>{
    const id = request.params.id;
    const person = persons.find(person => person.id === id)
    if (!person){
        return response.status(404).end()
    }
    
    persons = persons.filter((person=>person.id !== id))
    response.status(204).end()
    
})
app.post("/api/persons/", (request, response)=>{
    const randomId = Math.floor(Math.random() * 1000000)
    const body = request.body
    const reqName = body.name;
    const reqNumber = body.number;
    const checkName = persons.find(person=> person.name === reqName)
    if(!reqName){
        return response.status(400).json({error : "name is required"})
    }
    else if(!reqNumber){
        return response.status(400).json({error : "number is required"})
    }
    else if(checkName){
        return response.status(400).json({error:"name should be unique"})
    }
    const person = {name : reqName, number : reqNumber, id : String(randomId)}
    persons = persons.concat(person);
    response.status(201).json(person)
})


const PORT = 3001;
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    
});