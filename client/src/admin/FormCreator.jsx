import { useState, useEffect } from "react";
import Question from "./components/Question";
import { ToastContainer, toast } from "react-toastify";
import { formatQuestions, hasUniqueNotNullElements, validateAllNextQuestions } from "./functions";
import axios from "axios";

const FormCreator = () => {
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  //questions=>[
  //   {
  //     uniqueQuestionNumber:Number,
  //     type:String,
  //     description:String,
  //     options:[String],
  //     nextQuestions:[Number],
  //     generalNextQuestion:Number
  //   }
  //]

  useEffect(() => {
    if (localStorage.getItem("form-data")) {
      setQuestions(JSON.parse(localStorage.getItem("form-data")));
    }
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        uniqueQuestionNumber: "",
        type: "",
        description: "",
        options: [],
        nextQuestions: [],
        generalNextQuestion: "",
      },
    ]);
  };
  const deleteQuestion = (index) => {
    setQuestions((prevItems) => {
      return prevItems.filter((_, i) => i !== index);
    });
  };
  useEffect(() => {
    localStorage.setItem("form-data", JSON.stringify(questions));
  }, [questions.length]);

  const saveForm = async () => {
    try {
      const questionNumbers = questions.map(
        (question) => question.uniqueQuestionNumber
      );
      hasUniqueNotNullElements(questionNumbers);
      validateAllNextQuestions(questions, questionNumbers);
      const formattedQuestions=formatQuestions(formName,questions);
      
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER}/admin/create-form`,{
        name:formName,
        description:formDescription,
        questions:formattedQuestions,
      });
      if(data?.success){
        toast.success(data?.message);
        // localStorage.removeItem("form-data");
      }      
    } catch (error) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
  };
  return (
    <>
      <ToastContainer />
      <h1>Form</h1>
      <div>
        <input
          type="text"
          placeholder="Unique Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Form Description"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
        />
        <br />
        <br />
        <br />
        <br />
        {questions.map((question, index) => (
          <Question
            key={index}
            index={index}
            question={question}
            setQuestions={setQuestions}
            deleteQuestion={() => deleteQuestion(index)}
          />
        ))}
        <br />
        <br />
        <button onClick={addQuestion}>Add Question</button>
        <br />
        <br />
        <button onClick={saveForm}>Save Form</button>
      </div>
    </>
  );
};
export default FormCreator;
