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
      newNext[index] = +number || 0;
      return newNext;
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
            </div>
          ))}
          <button onClick={addOption}>Add Option</button>
        </div>
      )}
      <button onClick={deleteQuestion}>Delete Question</button>
    </>
  );
};

export default Question;
