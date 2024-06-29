import {Schema,model}from "mongoose";


const questionSchema = new Schema({
  _id:{ //overwritng the default _id
    type:String,
  },
  type: {
    type: String,
    enum:['message','text-response','multi-choice'],
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim:true,
  },
  options: [String],
  nextQuestions: {
    type: [String],
    ref:"questions",
    validate: {
      validator: function (v) {
        //Check if Options exists and its length is equal to NextQuestion, or if Options doesn't exist then length is 1
        return (
          (!this.Options && v.length === 1) ||
          (this.Options && v.length === this.Options.length)
        );
      },
      message: (props) => {
        if (!this.array1) {
          return `NextQuestion length (${props.value.length}) must be equal to 1 since question is of type "Text"`;
        } else {
          return `NextQuestion length (${props.value.length}) must be equal to Options length (${this.array1.length})`;
        }
      },
    },
  },
});

export default model("questions", questionSchema, "questions");
