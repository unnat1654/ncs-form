import {Schema,model } from "mongoose";


const formSchema= new Schema({
   name:{
    type:String,
    required:true,
    unique:true,
    trim:true
   },
   description:{
    type:String,
    trim:true,
   },
   questions:{
    type:[String],
    ref:"questions"
   },
   responses:[Schema.Types.Mixed],
})

export default model("forms",formSchema,"forms");