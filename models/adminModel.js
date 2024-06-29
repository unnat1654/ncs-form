import {Schema,model} from "mongoose";

const adminSchema = new Schema({
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

export default model("admins",adminSchema,"admins");