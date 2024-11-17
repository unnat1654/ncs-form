import { useState, useEffect } from "react";
import Question from "./components/Question";
import { ToastContainer, toast } from "react-toastify";
import {
  formatQuestions,
  hasUniqueNotNullElements,
  validateAllNextQuestions,
} from "./functions";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";



const FormCreator = () => {
  const [formName, setFormName] = useState("");
  const [event_id, setEvent_id] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if ((JSON.parse(localStorage.getItem("form-auth"))??{})?.username != "admin")
      return navigate(`/login?redirect=${location.pathname}`);
    if(localStorage.getItem("form-data"))
      setQuestions(JSON.parse(localStorage.getItem("form-data")));
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
      const formattedQuestions = formatQuestions(formName, questions);

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/emily/create-form`,
        {
          name: formName,
          event_id,
          description: formDescription,
          questions: formattedQuestions,
        }
      );
      if (data?.success) {
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
      <div className="container">

        {/* Form Header */}
        <h1>Form Manager</h1>

        {/* Form Name and Description Fields */}
        <div className="form-fields">
          <input
            className="Id"
            type="text"
            placeholder="Unique Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <input
            className="desc"
            type="text"
            placeholder="Form Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <input
            className="desc"
            type="text"
            placeholder="Enter event id"
            value={event_id}
            onChange={(e) => setEvent_id(e.target.value)}
          />
        </div>

        {/* Questions List */}
        {questions.map((question, index) => (
          <div className="question-container" key={index}>
            <Question
              index={index}
              question={question}
              setQuestions={setQuestions}
              deleteQuestion={() => deleteQuestion(index)}
            />
          </div>
        ))}

        {/* Form Actions */}
        <div className="form-actions">
          <button className="add-question-btn" onClick={addQuestion}>
            Add Question
          </button>
          <button className="save-form-btn" onClick={saveForm}>
            Save Form
          </button>
        </div>
      </div>
    </>
  );
};
export default FormCreator;
