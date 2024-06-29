import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

const AllFormList = () => {
  const[allforms, setAllForms] = useState([]);
  const navigate = useNavigate();
  const [auth,setAuth]=useAuth();

  const getForms = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/admin/get-forms`);
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
      const { data } = await axios.delete("/delete-form", { formId: _id });
      if(data?.success){
        toast.success(data?.message);
      }
      getForms();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <ToastContainer />
      <h1 className="all-forms-h1">All forms</h1>
      
      <button className="all-forms-create-new" onClick={handleNewFormClick}>
        Create New Form
      </button>
      <br />
      <br />
      <br />
      <br />
      <div className="all-forms-list">
        {allforms.map(({ _id, name, description }) => (
          <>
            <div className="all-forms-item" key={_id}>
              <hr/>
              <h3>{name}</h3>
              <p>{description}</p>
              <button onClick={(e) => handleFormDelete(e, _id)}>
                Delete Form
              </button>
            </div>
            <br />
            <hr/>
          </>
        ))}
      </div>
    </>
  );
};

export default AllFormList;
