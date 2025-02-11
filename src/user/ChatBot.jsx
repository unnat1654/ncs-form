import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../authContext";
import Navbar from "../component/Navbar";
import Lottie from "lottie-react";
import robotAnimation from "../assets/robot-chat.json";
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
  const inputRef = useRef(null);
  //formData:{_id:String,name:string,description:string,questions:[{_id:string,type:string,description:string,options:[String],nextQuestions:[String]}]}
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [nextQuestionId, setNextQuestionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [doc, setDoc] = useState("");
  const [fileName, setFileName] = useState("");
  const [qa, setQa] = useStateWithCallback({});
  const navigate = useNavigate();
  const location = useLocation();
  const chatContainerRef = useRef(null);

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
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          let count = 1;
          while (newCurrQues.type === "message") {
            newCurrQues = data.form.questions.find(
              (question) => question._id === newCurrQues.nextQuestions[0]
            );
            setTimeout(() => {
              addMessage(newCurrQues.description, true);
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }, 1000 * count++);
          }
          if (newCurrQues.type !== "multi-choice") {
            setNextQuestionId(newCurrQues.nextQuestions[0]);
          } else {
            setTimeout(() => {
              setShowOptions(true);
            }, 2000);
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
    const img = new Image();
    img.src = userIcon;
  }, [auth?.token]);

  const handleDoc = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      if (file.size > 2000000) {
        e.preventDefault();
        toast.error("Image size too large");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setDoc(reader.result);
      };
    }
  };

  const moveToNextQuestion = () => {
    if (
      (!prompt && !doc) ||
      (prompt && doc) ||
      prompt.startsWith("SZwgRYmUydiqLph6J7A6Adbck0fis3fy") ||
      (currentQuestion.type == "multi-choice" &&
        !currentQuestion.options.includes(prompt))
    )
      return;

    if (prompt) addMessage(prompt, false);
    if (doc) addMessage(`📁${fileName}`, false);
    setPrompt("");
    setDoc("");
    setFileName("");
    setShowOptions(false);
    setQa((prev) => {
      const newQa = { ...prev };
      if (doc)
        newQa[
          currentQuestion.description
        ] = `SZwgRYmUydiqLph6J7A6Adbck0fis3fy${doc}`;
      else newQa[currentQuestion.description] = prompt;

      if (!nextQuestionId) {
        submitResponse(newQa,1000);
        return;
      }
      let newCurrQues = formData.questions.find(
        (question) => question._id === nextQuestionId
      );
      let count=1;
      while (newCurrQues.type === "message") {
        const messageText = newCurrQues.description;

        setTimeout(() => {
          addMessage(messageText, true);
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }, 1500*count++);
        if (!newCurrQues.nextQuestions[0]) {
          submitResponse(newQa,1000*(count+1));
          setNextQuestionId("");
          setCurrentQuestion({});
          return;
        }
        newCurrQues = formData.questions.find(
          (question) => question._id === newCurrQues.nextQuestions[0]
        );
      }
      setTimeout(() => {
        addMessage(newCurrQues.description, true);
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 1500*count++);

      if (newCurrQues.type !== "multi-choice") {
        setNextQuestionId(newCurrQues.nextQuestions[0]);
      } else {
        setTimeout(() => {
          setShowOptions(true);
        }, 1500*count);
      }

      setCurrentQuestion(newCurrQues);
      return newQa;
    });
  };

  // useEffect(() => {
  //   else setShowOptions(false);
  // }, [currentQuestion]);

  //add messages to chat(both questions and answers) using this function
  const addMessage = (message, isQuestion) => {
    if (!message) return;
    setMessages((prev) => [...prev, { message, isQuestion }]);
  };

  const submitResponse = async (quesAns,time) => {
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_SERVER}/emily/submit-response`,
        {
          formId: id,
          userResponse: quesAns,
        }
      );
      if (data?.success) {
        setTimeout(() => {
          toast.success(data?.message);
        }, time);

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
      <div className="chat-container" ref={chatContainerRef}>
        <div className="bot-intro">
          <Lottie
            animationData={robotAnimation}
            loop={true}
            style={{ width: "50%", height: "50%" }}
            className="bot-avatar"
          />
          <h2 className="bot-intro-name">{formData.name}</h2>
          <p  className="bot-intro-greeting">Emily presents to you,</p>
          <p className="bot-intro-description">{formData.description}</p>
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
                  {isQuestion
                    ? message.split(" ").map((word, index) => (
                        <span
                          key={index}
                          className="word"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          {word}&nbsp;
                        </span>
                      ))
                    : message}
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
              {currentQuestion?.type === "multi-choice" &&
                showOptions &&
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

          <div
            onClick={(e) => {
              if (e.target.tagName !== "BUTTON") {
                inputRef?.current?.focus();
              }
            }}
            className="input-box"
          >
            {currentQuestion?.type !== "file" ? (
              <input
                placeholder="type your message"
                value={prompt}
                ref={inputRef}
                onChange={(e) => setPrompt(e.target.value)}
                type="text"
                className="prompt"
                onKeyDown={handleKeyDown}
                disabled={
                  !currentQuestion.type ||
                  currentQuestion.type !== "text-response"
                }
              />
            ) : (
              <>
                <label htmlFor="upload-file" className="file-prompt">
                  {fileName ? fileName : "Upload Image"}
                </label>
                <input
                  type="file"
                  id="upload-file"
                  onChange={handleDoc}
                  onKeyDown={handleKeyDown}
                  name="file-input"
                  accept="image/*"
                  hidden
                />
              </>
            )}
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
