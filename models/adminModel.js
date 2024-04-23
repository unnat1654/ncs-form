import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        maxLength:50,
        required:true,
        unique:true
    },
    password:{
        type:String,
        maxLength:300,
        required:true,
    },
    authorization:{
        type:Boolean,
        default:false,
    }
});

export default mongoose.model("admins",adminSchema,"admins");