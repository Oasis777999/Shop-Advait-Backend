const mongooose = require("mongoose");
const DB = process.env.database;

try{
    mongooose.connect(DB);
    console.log("Connected to database");
    
}
catch(error){
    console.log("Got Error : ", error);
    
}