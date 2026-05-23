const mongoose = require("mongoose");

if (process.argv.length < 3){
    console.log("password is compulsury");
    process.exit(1)
}

const password = process.argv[2]
const url =`mongodb+srv://masefhfi_db_user:${password}@cluster0.qgzeezu.mongodb.net/?appName=Cluster0`
mongoose.set("strictQuery", false)
mongoose.connect(url, ({family : 4}))

const personSchema = new mongoose.Schema({
    name : String,
    number:String
})
const PersonModel = mongoose.model("Persons", personSchema);

personData = new PersonModel({
    name : process.argv[3],
    number : process.argv[4]
});

if (process.argv.length > 3){
    personData.save().
then(result =>{
    console.log("saved");

})
}

if (process.argv.length === 3){
    PersonModel.find({}).then(result =>{
        result.forEach(person =>{
            console.log(person.name, person.number)
        })
    })
}
