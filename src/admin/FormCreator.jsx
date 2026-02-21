import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
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
    if ((JSON.parse(localStorage.getItem("form-auth")) ?? {})?.username != "admin")
      return navigate(`/login?redirect=${location.pathname}`);
    if (localStorage.getItem("form-data"))
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
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">

        {/* Form Header */}
        <h1 className="text-4xl font-extrabold text-center text-primary-300 mb-10 tracking-tight">Form Manager</h1>

        {/* Form Name and Description Fields */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 transition-all hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              type="text"
              placeholder="Unique Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
            <input
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              type="text"
              placeholder="Enter event id"
              value={event_id}
              onChange={(e) => setEvent_id(e.target.value)}
            />
          </div>
          <textarea
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all bg-gray-50 hover:bg-white resize-none"
            rows="3"
            placeholder="Form Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />

        </div>

        {/* Questions List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {questions.map((question, index) => (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative group transition-all hover:shadow-xl" key={index}>
              <Question
                index={index}
                question={question}
                setQuestions={setQuestions}
                deleteQuestion={() => deleteQuestion(index)}
              />
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="max-w-4xl mx-auto mt-10 flex justify-end gap-4 pb-10">
          <button
            className="px-6 py-3 bg-white text-primary-300 border-2 border-primary-200 font-semibold rounded-xl hover:bg-primary-50 transition-colors duration-200 shadow-sm"
            onClick={addQuestion}
          >
            + Add Question
          </button>
          <button
            className="px-8 py-3 bg-primary-200 text-white font-semibold rounded-xl hover:bg-primary-300 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={saveForm}
          >
            Save Form
          </button>
        </div>
      </div>
    </>
  );
};
export default FormCreator;