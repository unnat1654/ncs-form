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
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions.splice(optionIndex, 1);
      return newOptions;
    });
    setNextQuestions((prev) => {
      const newOptions = [...prev];
      newOptions.splice(optionIndex, 1);
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Q. No</label>
          <input
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent bg-gray-50 hover:bg-white transition-all text-center font-semibold"
            type="number"
            placeholder="#"
            value={uniqueQuestionNumber}
            onChange={(e) => setUniqueQuestionNumber(e.target.value)}
            onBeforeInput={handleBeforeInput}
            required
          />
        </div>

        <div className="md:col-span-7">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
          <input
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
            type="text"
            placeholder="What is the question?"
            value={questionDescription}
            onChange={(e) => setQuestionDescription(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
          <select
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent bg-gray-50 hover:bg-white transition-all appearance-none cursor-pointer"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="message">Message</option>
            <option value="text-response">Text Response</option>
            <option value="multi-choice">Multi Choice</option>
            <option value="file">File Upload</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Next Question Logic</label>
            <input
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
              type="number"
              placeholder="Jump to Question #"
              value={generalNextQuestion}
              onChange={(e) => setNextQuestionAll(e.target.value)}
              onBeforeInput={handleBeforeInput}
            />
          </div>
        </div>
      </div>

      {questionType === "multi-choice" && (
        <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Options Configuration</h4>
          <div className="space-y-3">
            {options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="flex-grow w-full md:w-auto">
                  <input
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all text-sm"
                    type="text"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleOptionDescriptionChange(optionIndex, e.target.value)
                    }
                    required
                  />
                </div>
                <div className="w-full md:w-32">
                  <input
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all text-sm"
                    type="number"
                    placeholder="Next Q#"
                    value={nextQuestions[optionIndex]}
                    onChange={(e) =>
                      updateNextQuestionSingle(optionIndex, e.target.value)
                    }
                    onBeforeInput={handleBeforeInput}
                    required
                  />
                </div>
                <button
                  onClick={() => deleteOption(optionIndex)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Option"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addOption}
            className="mt-4 px-4 py-2 bg-white border border-primary-200 text-primary-300 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Option
          </button>
        </div>
      )}

      {/* Absolute positioned delete button for the card */}
      <button
        onClick={deleteQuestion}
        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Delete Question"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </>
  );
};

export default Question;