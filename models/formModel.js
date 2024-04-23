import mongoose, { mongo } from "mongoose";


const formSchema= new mongoose.Schema({
   name:{
    type:String,
    required:true,
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

export default mongoose.model("forms",formSchema,"forms");