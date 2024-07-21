export const hasUniqueNotNullElements = (array) => {
  const uniqueElements = new Set();
  for (const element of array) {
    if (element === "" || element === null || element === undefined) {
      throw new Error("Containing null question numbers");
    }
    if (uniqueElements.has(element)) {
      throw new Error("Containing repeating question numbers");
    }
    uniqueElements.add(element);
  }
};

export const validateAllNextQuestions = (questions, questionNumbers) => {
  const uniqueNextQuestions = new Set();
  for (const question of questions) {
    for (const nextQuestion of question.nextQuestions) {
      uniqueNextQuestions.add(nextQuestion);
    }
  }
  if (!uniqueNextQuestions.has("")) {
    throw new Error("Contains no ending for form");
  }
  const uniqueNextQuesArray = Array.from(uniqueNextQuestions);
  console.log(questionNumbers)
  if (uniqueNextQuesArray.some(NextQues => (!questionNumbers.includes(`${NextQues}`) && NextQues!=""))) {
    throw new Error("Next Questions contains unknown question numbers")
  }
}

export const formatQuestions = (formName, questions) => {
  return questions.map(({ uniqueQuestionNumber, type, description, options, nextQuestions, generalNextQuestion }) => {
    if (!description || !type)
      throw new Error("Question Description or type missing");
    if (type == "multi-choice") {
      if (!options.length)
        throw new Error("Options missing");
      if (options.length != nextQuestions.length)
        throw new Error("Options and next Questions dont match");
    }
    if (type != "multi-choice" && (options.length || nextQuestions.length != 1))
      throw new Error("text or message question format incorrect");

    return {
      _id: `${formName}.${uniqueQuestionNumber}`,
      type: type,
      description: description,
      options: options,//[] or [string]
      nextQuestions: nextQuestions.map(nextQuestion => nextQuestion ? `${formName}.${nextQuestion}` : "")
    };
  });
}