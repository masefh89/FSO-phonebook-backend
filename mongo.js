const mongoose = require("mongoose");

if(process.argv.length < 3){
    console.log("Passwrod should be included")
    process.exit(1)
};

const password = process.argv[2];
const url = `mongodb+srv://masefhfi_db_user:${password}@cluster0.qgzeezu.mongodb.net/personsData?appName=Cluster0`

mongoose.set("strictQuery",false);
mongoose.connect(url,({family:4})).then(res=>{
    console.log("Connection: successfull")
})
.catch(error=>{
    console.log(`Connection's error massage: ${error.message}`)
    mongoose.connection.close()
});
const personSchema = new mongoose.Schema({
    name : String,
    number: String,
});

const PersonModel= mongoose.model("Person", personSchema);

const person= new PersonModel({
    name : process.argv[3],
    number : process.argv[4]
});
 
if (process.argv.length > 3){
    person.save().then(result=>{
    console.log(result.name, result.number)
    mongoose.connection.close()
})
.catch(error=>{
    console.log(`the error message of save process: ${error.message}`)
});
}


if (process.argv.length === 3){
    PersonModel.find({}).then(res=>{
        res.forEach(person => {
            console.log(person.name, person.number) 
            
        });
        mongoose.connection.close()
        
    })
    .catch(error=>{
        console.log("error from fetching all persons from server")
    })
    
};

