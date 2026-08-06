import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        default : ""
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    lists : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "List"
        },
    ]
},{ timestamps : true});

export default mongoose.model("Board", boardSchema)