import { useCallback, useEffect, useState } from "react";

const Question = ({ index, question, setQuestions, deleteQuestion }) => {
  const [uniqueQuestionNumber, setUniqueQuestionNumber] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [nextQuestions, setNextQuestions] = useState([]);
  const [generalNextQuestion, setGeneralNextQuestion] = useState("");

  useEffect(() => {
    if (questionType !== "multi-choice") {
      setNextQuestions([generalNextQuestion]);
    }
  }, [questionType]);

  const setNextQuestionAll = (number) => {
    setGeneralNextQuestion(+number || "");
    const updatedNextQuestionsArray = new Array(nextQuestions.length).fill(
      +number || 0
    );
    setNextQuestions(updatedNextQuestionsArray);
  };

  const updateNextQuestionSingle = (index, number) => {
    setNextQuestions((prev) => {
      const newNext = [...prev];
      newNext[index] = +number || null;
      return newNext;
    });
  };
  const deleteOption = (optionIndex) => {
    setOptions((prev)=>{
      const newOptions = [...prev];
      newOptions.splice(optionIndex,1);
      return newOptions;
    });
    setNextQuestions((prev)=>{
      const newOptions = [...prev];
      newOptions.splice(optionIndex,1);
      return newOptions;
    });
  };

  const setComponentStates = useCallback(() => {
    setUniqueQuestionNumber(question.uniqueQuestionNumber);
    setQuestionType(question.type);
    setQuestionDescription(question.description);
    setOptions(question.options);
    setNextQuestions(question.nextQuestions);
    setGeneralNextQuestion(question.generalNextQuestion);
  }, [question]);

  useEffect(() => {
    setComponentStates();
  }, [setComponentStates]);

  const addOption = () => {
    setOptions([...options, ""]);
    setNextQuestions([...nextQuestions, generalNextQuestion]);
  };

  const handleOptionDescriptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleBeforeInput = (e) => {
    // Allow only numeric characters
    if (!/^\d*$/.test(e.data)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    setQuestions((prev) => {
      prev[index] = {
        uniqueQuestionNumber,
        type: questionType,
        description: questionDescription,
        options,
        nextQuestions,
        generalNextQuestion,
      };
      localStorage.setItem("form-data", JSON.stringify(prev));
      return prev;
    });
  }, [
    uniqueQuestionNumber,
    questionType,
    questionDescription,
    options,
    nextQuestions,
    generalNextQuestion,
  ]);

  return (
    <>
      <input
        type="number"
        placeholder="Enter a unique Question Number"
        value={uniqueQuestionNumber}
        onChange={(e) => setUniqueQuestionNumber(e.target.value)}
        onBeforeInput={handleBeforeInput}
        required
      />
       
      <input
        type="text"
        placeholder="Question Description"
        value={questionDescription}
        onChange={(e) => setQuestionDescription(e.target.value)}
        required
      />
      <select
        value={questionType}
        onChange={(e) => setQuestionType(e.target.value)}
      >
        <option value="">Select Question Type</option>
        <option value="message">Message</option>
        <option value="text-response">Text Response</option>
        <option value="multi-choice">Multi Choice</option>
        <option value="file">File</option>
      </select>
      <input
        type="number"
        placeholder="Next Question"
        value={generalNextQuestion}
        onChange={(e) => setNextQuestionAll(e.target.value)}
        onBeforeInput={handleBeforeInput}
      />
      {questionType === "multi-choice" && (
        <div>
          {options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <input
                type="text"
                placeholder={`Option ${optionIndex + 1} Description`}
                value={option}
                onChange={(e) =>
                  handleOptionDescriptionChange(optionIndex, e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder={`Next Question Number for Option ${
                  optionIndex + 1
                }`}
                value={nextQuestions[optionIndex]}
                onChange={(e) =>
                  updateNextQuestionSingle(optionIndex, e.target.value)
                }
                onBeforeInput={handleBeforeInput}
                required
              />
              <button onClick={()=>deleteOption(optionIndex)}>DeleteOption</button>
            </div>
          ))}
          <button onClick={addOption}>Add Option</button>
          
        </div>
      )}
      <button onClick={deleteQuestion} className=" text-red-400 hover:text-red-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
    </>
  );
};

export default Question;
