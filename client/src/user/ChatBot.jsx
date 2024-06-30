import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ChatBot = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");

  const fetchForm = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}/user/get-form/${id}`
      );
      if (data?.success) {
        setFormData(data?.form);
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchForm();
  }, []);
  //add messages to chat(both questions and answers) using this function
   const addMessage=(message)=>{

   };

   const submitResponse=async()=>{
    try {
        const {data} = await axios.post(`${import.meta.env.VITE_SERVER}/user/submit-response`);
    } catch (error) {
        
    }
   }
  return (
    <div className="chatbot">
      <ToastContainer />
      <div>
        <h1>Form Name</h1>
        <p>Description</p>
      </div>
      <div>
        <div className="display">
          <p className="message">question</p>
          <p className="message answer">answer</p>
        </div>
        <ul className="options"></ul>
        <input placeholder="type your message" value={prompt} onChange={(e)=>setPrompt(e.target.value)} type="text" className="prompt" />
        <button onClick={submitResponse} className="send" />
      </div>
    </div>
  );
};

export default ChatBot;
