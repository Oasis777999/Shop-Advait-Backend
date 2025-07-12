const mongooose = require("mongoose");

const productSchema = new mongooose.Schema({
    name:{
        type:String
    },
    category:{
        type:String
    },
    brand:{
        type:String
    },
    sku:{
        type:String
    },
    shortDesc:{
        type:String
    },
    status:{
        type:Boolean
    },
    costPrice:{
        type:String
    },
    sellPrice:{
        type:String
    },
    sequence:{
        type:String
    },
    length:{
        type:Number
    },
    breadth:{
        type:Number
    },
    height:{
        type:Number
    },
    weight:{
        type:Number
    },
    colour:{
        type:String
    },
    warranty:{
        type:String
    },
}, { timestamps: true })

module.exports = mongooose.model("product", productSchema);