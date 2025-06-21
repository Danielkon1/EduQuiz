import { AppBar, IconButton, TextField } from "@mui/material";
import { user } from "./Signup";
import "./design.css";
import { useEffect, useState } from "react";
import { QuizQuestion } from "./User";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api";

function GameCreation() {
  const navigate = useNavigate();

  // States for quiz setup
  const [quizName, setQuizName] = useState("");
  const [finalQuizName, setFinalQuizName] = useState("");

  const [quiz, setQuiz] = useState<QuizQuestion[]>();
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);

  // State for current question being edited
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    question: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correct: "1",
  });

  // Add current question to quiz and reset input
  const addQuestion = () => {
    if (
      Number(currentQuestion.correct) < 1 ||
      Number(currentQuestion.correct) > 4
    ) {
      alert("Correct answer must be a number between 1-4, ");
      return;
    }

    if (quiz === undefined) {
      setQuiz([currentQuestion]);
    } else {
      setQuiz([...quiz, currentQuestion]);
    }

    // Reset for next question
    setCurrentQuestion({
      question: "",
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: "",
      correct: "1",
    });

    setCurrentQuestionNumber(currentQuestionNumber + 1);
  };

  // Send full quiz to the server
  const sendQuiz = async () => {
    try {
      const endpoint = `/add_quiz`;
      const name = finalQuizName;
      const content = quiz;
      const username = user.username;
      const data = { name, content, username };

      await postRequest(endpoint, data);

      navigate("/user");
    } catch (error) {
      console.error("Error during add_quiz:", error);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (user.username === "" || user.password === "") {
      navigate("/");
    }
  }, []);

  return (
    <>
      {/* Top bar with navigation */}
      <AppBar className="userAppBar">
        <div className="appBarContent">
          <img src="/MainLogo.png" className="mainLogo" />
          <div className="leftContent">
            <div className="stickTopLeft">
              <IconButton onClick={() => navigate("/user")}>
                <ArrowBackIcon />
              </IconButton>
              <IconButton onClick={() => navigate("/")}>
                <HomeIcon />
              </IconButton>
            </div>
          </div>

          <h2>Game Creation</h2>
        </div>
      </AppBar>

      {/* Quiz Name input phase */}
      {(finalQuizName === "" && (
        <>
          <TextField
            label={"Enter Quiz Name"}
            variant="outlined"
            className="custom-text-field"
            multiline
            onChange={(e) => setQuizName(e.target.value)}
          />
          <br />
          <br />
          <button onClick={() => setFinalQuizName(quizName)}>
            Confirm Name
          </button>
        </>
      )) ||

        // Question creation phase
        (
          <>
            <h1>Question Number {currentQuestionNumber}</h1>
            <br />
            <TextField
              label={"Question"}
              variant="outlined"
              className="custom-text-field"
              multiline
              value={currentQuestion.question}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value,
                })
              }
            />
            <br />
            <br />
            <TextField
              label={"Answer 1"}
              variant="outlined"
              className="custom-text-field"
              multiline
              value={currentQuestion.answer1}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  answer1: e.target.value,
                })
              }
            />
            <TextField
              label={"Answer 2"}
              variant="outlined"
              className="custom-text-field"
              multiline
              value={currentQuestion.answer2}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  answer2: e.target.value,
                })
              }
            />
            <TextField
              label={"Answer 3"}
              variant="outlined"
              className="custom-text-field"
              multiline
              value={currentQuestion.answer3}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  answer3: e.target.value,
                })
              }
            />
            <TextField
              label={"Answer 4"}
              variant="outlined"
              className="custom-text-field"
              multiline
              value={currentQuestion.answer4}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  answer4: e.target.value,
                })
              }
            />
            <br />
            <br />
            <TextField
              label={"Number of Correct Answer"}
              variant="outlined"
              className="custom-text-field"
              type="number"
              inputProps={{
                min: 1,
                max: 4,
              }}
              value={Number(currentQuestion.correct)}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  correct: e.target.value,
                })
              }
            />
            <br />
            <br />
            <button onClick={addQuestion}>Add Question</button>
            <br />
            <br />
            <button onClick={sendQuiz}>Finish Quiz</button>
          </>
        )}
    </>
  );
}

export default GameCreation;
