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

  const [quizName, setQuizName] = useState("");
  const [finalQuizName, setFinalQuizName] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>();
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    question: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correct: "1",
  });

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

  useEffect(() => {
    if (user.username === "" || user.password === "") {
      navigate("/");
    }
  }, []);

  return (
    <>
      <AppBar className="userAppBar">
        <div className="appBarContent">
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

          <h2>EduQuiz - Game Creation</h2>
        </div>
      </AppBar>

      {(finalQuizName === "" && (
        <>
          <TextField
            label={"enter quiz name"}
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
      )) || (
        <>
          <h1>question number {currentQuestionNumber}</h1>
          <br />
          <TextField
            label={"enter question"}
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
            label={"enter answer 1"}
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
            label={"enter answer 2"}
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
            label={"enter answer 3"}
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
            label={"enter answer 4"}
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
            label={"enter number of correct answer"}
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
