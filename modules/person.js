
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const url= process.env.MONGODB_URI;

mongoose.connect(url,({family:4})).then(
    res =>{
        console.log("Connected to MONGODB")
    }
)
.catch(error=>{
    console.log(`error occured with connection process ${error.message}`)
})

const personSchema = new mongoose.Schema({
    name:{
        type: String,
        minLength : 3,
        required : true
    },
    number: String
})

personSchema.set("toJSON",{
    transform:(document, convertedToObjectDoc)=>{
        convertedToObjectDoc.id=document._id.toString()
        delete convertedToObjectDoc._id;
        delete convertedToObjectDoc.__v;
    }
})

module.exports = mongoose.model("Person", personSchema);

