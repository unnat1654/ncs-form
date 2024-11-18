import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import { MdDelete } from "react-icons/md";
import { BiSolidArrowToBottom, BiSolidPencil } from "react-icons/bi";
import robot from "../assets/robot.svg";
import "./AllFormList.css";

const AllFormList = () => {
  const [allforms, setAllForms] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  const getForms = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}/emily/get-forms`
      );
      if (data?.success) {
        toast.success(data?.message);
        setAllForms(data?.forms);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    if ((JSON.parse(localStorage.getItem("form-auth"))??{})?.username != "admin")
      navigate(`/login?redirect=${location.pathname}`);
    if(!auth?.token) return;
    getForms();
  }, [auth?.token]);

  const handleNewFormClick = useCallback((e) => {
    e.preventDefault();
    navigate("/create-form");
  }, []);

  const handleFormDelete = async (e, _id) => {
    try {
      e.preventDefault();
      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER}/emily/delete-form/${_id}`,
        { formId: _id }
      );
      if (data?.success) 
        toast.success(data?.message);
      
      await getForms();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const handleFormResponsesDownload = async (e, _id) => {
    try {
      e.preventDefault();
      const response = await axios.get(`${import.meta.env.VITE_SERVER}/emily/get-responses/${_id}`,{responseType:"blob"});

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Responses_${_id}.xlsx`); // Use a suitable filename
    document.body.appendChild(link);
    link.click();
    link.remove();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ToastContainer />

      {/* Bot Avatar and Welcome Message */}
      <div className="welcome-section">
        <img src={robot} alt="Bot Avatar" className="bot-avatar" />
        <div className="welcome-message">
          <h2>Hello!</h2>
          <p>Welcome to the Form Management Dashboard. Here you can view, edit, and manage all forms.</p>
        </div>
      </div>

      <div className="all-forms-header">
  <h1 className="all-forms-h1">All Forms</h1>
  <button className="all-forms-create-new" onClick={handleNewFormClick}>
    Create New Form
  </button>
</div>

<div className="all-forms-list">
  {allforms.map(({ _id, name, description }) => (
    <div className="all-forms-item" key={_id}>
      <div className="form-info">
        <h3 className="form-title">{name}</h3>
        <p className="form-description">{description}</p>
      </div>
      <div className="form-actions">
        <button onClick={(e) => handleFormDelete(e, _id)} className="delete">
        <MdDelete/>
        </button>
        <button>
          <BiSolidPencil/>
        </button>
        <button onClick={(e) => handleFormResponsesDownload(e, _id)}>
          <BiSolidArrowToBottom />
        </button>
      </div>
    </div>
  ))}
</div>

     
    </>
  );
};

export default AllFormList;
