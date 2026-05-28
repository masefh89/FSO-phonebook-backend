require("dotenv").config()
const express = require ("express")
const Person = require("./modules/person")
const morgan = require("morgan")

const app = express()
app.use(express.static("dist"))

morgan.token("body", function (req){return JSON.stringify(req.body)})
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
app.use(express.json())
app.get("/", (req,res) => {
  return res.send("<h2> The backend is running </h2>")
})

app.get("/api/persons", (request , response) => {
  Person.find({}).then(result => {
    console.log(`the result of get request ${result.length}`)
    return response.json(result)
  })

})
app.get("/info", (request, response) => {
  const date = new Date()
  Person.find({}).then(result => {
    const info = (`<div>
        <h2>Phonebook has info for ${result.length} people</h2>
        <h3>${date}</h3>
        </div>`)
    response.send(info)
  })

})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  console.log(id)
  Person.findById(id).then(result => {
    if (!result){
      return response.status(404).end()
    }
    response.json(result)
  })
})

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(
    person => {
      if(!person){
        return response.status(404).end()
      }
      response.status(204).end()
    }
  )
    .catch(error => { next(error)})

})
app.post("/api/persons", (req, res, next) => {
  const { name , number } = req.body
  Person.findOne({ name:name }).then(result => {
    if (result){
      return res.status(400).send("name should be unique").end()
    }
    const person = new Person({
      name: name,
      number: number
    })
    person.save().then(savedPerson => {return res.json(savedPerson)}
    ).catch(error => { next(error)})
  }).catch(error => { next(error)})
})
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body
  Person.findById(request.params.id).then(person => {
    console.log(`the update log person ${person}`)
    if (!person){return response.status(404).end()}
    person.name = name
    person.number = number
    return person.save().then(updatedPerson => {
      console.log(`updatedPerson ${updatedPerson}`)
      response.json(updatedPerson)
    })
  })
    .catch(error => { next(error)})
})


const errorHandler=(error, request, response, next) => {
  console.log(error.message)
  if (error.name === "CastError"){
    return response.status(400).send({ error: "mlformated id" })
  }
  else if (error.name === "ValidationError"){
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)

})