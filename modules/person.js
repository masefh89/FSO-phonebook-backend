
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
    number: {
        required: true,
        type:String,
        minLength : 8,
        validate:{
            validator:function(value){
            return /\d{2,3}-\d+/.test(value)
        },
        
        message: props => `number should be in two parts, first part can includes 2 or 3 digits and then the rest `
        }
    }
})

personSchema.set("toJSON",{
    transform:(document, convertedToObjectDoc)=>{
        convertedToObjectDoc.id=document._id.toString()
        delete convertedToObjectDoc._id;
        delete convertedToObjectDoc.__v;
    }
})

module.exports = mongoose.model("Person", personSchema);

