import { TextField } from "@mui/material";
import { useState, useSyncExternalStore } from "react";
import "./design.css";

function GameCreation() {
  const quiz: {
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
  }[] = [];
  const [qNum, setQNum] = useState(1);
  const [question, setQuestion] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");

  const answers = [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "4" },
  ];

  const handleAddQuestion = () => {
    const finalQuestion = {
      question: question,
      answer1: answer1,
      answer2: answer2,
      answer3: answer3,
      answer4: answer4,
    };
    quiz.push(finalQuestion);
    console.log(quiz);

    setQuestion("");
    setAnswer1("");
    setAnswer2("");
    setAnswer3("");
    setAnswer4("");
    setQNum(qNum + 1);
  };

  const setQuestionText = (aNumber: string, text: string) => {
    if (aNumber === "1") {
      setAnswer1(text)
    } else if (aNumber === "2") {
      setAnswer2(text)
    } else if (aNumber === "3") {
      setAnswer3(text)
    } else {
      setAnswer4(text)
    }
  }

  return (
    <>
      <TextField
        label={"question" + qNum}
        variant="outlined"
        className="custom-text-field"
        onChange={(e) => setQuestion(e.target.value)}
      />

      {answers.map((field) => (
        <TextField
          key={field.label}
          label={field.label}
          className="custom-text-field"
          onChange={(e) => setQuestionText(field.label, e.target.value)}
        />
      ))}

      <br />
      <button onClick={handleAddQuestion}>Add Question</button>
    </>
  );
}

export default GameCreation;
