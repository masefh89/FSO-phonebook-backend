require("dotenv").config()
const express = require ("express");
const Person = require("./modules/person")
const morgan = require("morgan")

const app = express();
app.use(express.static("dist"))

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
app.get("/", (req,res)=>{
    return res.send("<h2> The backend is running </h2>")
})

app.get("/api/persons", (request , response)=>{
    Person.find({}).then(result=>{
        console.log(`the result of get request ${result.length}`)
        return response.json(result)
    })
    
});
app.get("/info", (request, response)=>{
    const date = new Date()
    Person.find({}).then(result=>{
        const info = (`<div>
        <h2>Phonebook has info for ${result.length} people</h2>
        <h3>${date}</h3>
        </div>`)
        response.send(info)
    })
    
})

app.get("/api/persons/:id", (request, response)=>{
    const id = request.params.id
    console.log(id)
    Person.findById(id).then(result=>{
        if (!result){
            return response.status(404).end()
        }
        response.json(result)
    })  
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
    
    const body = request.body
    const reqName = body.name;
    const reqNumber = body.number;
    
    const checkName = Person.find({name:reqName}).then(result=>{
        console.log(`the result ${Array.isArray(result)}`)
    })
    if(!reqName){
        return response.status(400).json({error : "name is required"})
    }
    if(!reqNumber){
        return response.status(400).json({error : "number is required"})
    }
    if(checkName){
        console.log(`we are checking if there is a name with ${checkName}`)
        //return response.status(400).json({error:"name should be unique"})
    }
    
    //console.log(`here is the find method's result ${checkName.name}`)
    const person=new Person({
        name:reqName,
        number:reqNumber
    })
    person.save().then(
        result=>{
            console.log(`we posted ${result.name} and ${result.number} to mongodb`)
            response.json(result)
        }
    )
    .catch(error=>{
        console.log(`error for posting the data to mongodb: ${error.message}`)
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    
});