import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../authContext";
import Navbar from "../component/Navbar";
import robot from "../assets/robot.svg";
import robot2 from "../assets/chat_robot.svg";
import userIcon from "../assets/user_icon.svg";
 import { IoSend } from "react-icons/io5";
import "./ChatBot.css";

const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef(null);

  const setStateWithCallback = (newState, callback) => {
    callbackRef.current = callback;
    setState(newState);
  };

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = null;
    }
  }, [state]);

  return [state, setStateWithCallback];
};

const ChatBot = () => {
  const { id } = useParams();
  const [auth, setAuth] = useAuth();
  const [formData, setFormData] = useState({});
  //formData:{_id:String,name:string,description:string,questions:[{_id:string,type:string,description:string,options:[String],nextQuestions:[String]}]}
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [nextQuestionId, setNextQuestionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [qa, setQa] = useStateWithCallback({});
  const navigate = useNavigate();
  const location = useLocation();

  const fetchForm = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}/emily/get-form/${id}`
      );
      if (data && data.success) {
        setFormData(data.form);
        setCurrentQuestion(() => {
          let newCurrQues = data.form.questions[0];
          addMessage(newCurrQues.description, true);
          while (newCurrQues.type === "message") {
            newCurrQues = data.form.questions.find(
              (question) => question._id === newCurrQues.nextQuestions[0]
            );
            addMessage(newCurrQues.description, true);
            if (newCurrQues.type !== "multi-choice") {
              setNextQuestionId(newCurrQues.nextQuestions[0]);
            }
          }
          return newCurrQues;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("form-auth"))
      navigate(`/login?redirect=${location.pathname}`);
    if (!auth?.token) return;
    fetchForm();
  }, [auth?.token]);

  const moveToNextQuestion = () => {
    if (!prompt) return;
    addMessage(prompt, false);
    setPrompt("");
    setQa((prev) => {
      const newQa = { ...prev };
      newQa[currentQuestion.description] = prompt;

      if (!nextQuestionId) submitResponse(newQa);

      let newCurrQues = formData.questions.find(
        (question) => question._id === nextQuestionId
      );
      addMessage(newCurrQues.description, true);

      while (newCurrQues.type === "message") {
        console.log(newCurrQues);
        if (!newCurrQues.nextQuestions[0]) {
          submitResponse(newQa);
          setNextQuestionId("");
          return;
        }
        newCurrQues = formData.questions.find(
          (question) => question._id === newCurrQues.nextQuestions[0]
        );
        addMessage(newCurrQues.description, true);
      }

      if (newCurrQues.type !== "multi-choice") {
        setNextQuestionId(newCurrQues.nextQuestions[0]);
      }

      setCurrentQuestion(newCurrQues);
      return newQa;
    });
  };

  //add messages to chat(both questions and answers) using this function
  const addMessage = (message, isQuestion) => {
    if (!message) return;
    setMessages((prev) => [...prev, { message, isQuestion }]);
  };

  const submitResponse = async (quesAns) => {
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_SERVER}/emily/submit-response`,
        {
          formId: id,
          userResponse: quesAns,
        }
      );
      if (data?.success) {
        toast.success(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      moveToNextQuestion();
    }
  };
  return (
    <div className="chatbot">
      <ToastContainer />
      <Navbar />
      <div className="chat-container">
        <div className="bot-intro">
          <img src={robot} alt="Bot Avatar" className="bot-avatar" />
          <h2>{formData.name}</h2>
          <p>Emily presents to you,</p>
          <p>{formData.description}</p>
        </div>

      <div className="chat-box">
        <div className="display">
          {messages.map(({ message, isQuestion }, index) => (
            <div key={index} className="message-wrapper">
              {isQuestion && (
                <img
                  src={robot2}
                  alt="Bot Avatar"
                  className="inline-bot-avatar"
                />
              )}
              <span className={`message${isQuestion ? " question" : ""}`}>
                {message}
              </span>
              {!isQuestion && (
                <img
                  src={userIcon}
                  alt="user-icon"
                  className="inline-user-avatar"
                />
              )}
            </div>
          ))}
          <ul className="options">
            {currentQuestion.type === "multi-choice" &&
              currentQuestion.options.map((option, index) => (
                <li
                  className="option"
                  key={`${currentQuestion._id}.${index}`}
                  onClick={() => {
                    setNextQuestionId(currentQuestion.nextQuestions[index]);
                    setPrompt(option);
                  }}
                >
                  {option}
                </li>
              ))}
          </ul>
        </div>

        <div className="input-box">
          <input
            placeholder="type your message"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            className="prompt"
            onKeyDown={handleKeyDown}
            disabled={currentQuestion.type === "multi-choice"}
          />
          <button onClick={moveToNextQuestion} className="send-btn">
            <IoSend className="arrow" />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChatBot;
