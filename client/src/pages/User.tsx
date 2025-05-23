import { AppBar, Button, Collapse, IconButton } from "@mui/material";
import { user } from "./Signup";
import { useState } from "react";
import "./design.css";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { postRequest, ResponseType } from "../api";

function User() {
  const navigate = useNavigate();

  type QuizCode = { code: string };
  type QuizQuestion = {
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    correct: string;
  };

  const [open, setOpen] = useState(false);
  const [isInQuiz, setIsInQuiz] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizContent, setQuizContent] = useState<(QuizCode | QuizQuestion)[]>(
    []
  );

  const getQuizzes = async () => {
    const endpoint = `/quiz_list?username=${encodeURIComponent(user.username)}`;
    try {
      const response = await fetch(`http://localhost:4443${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const text = await response.json();
      setQuizList(text);
    } catch (error) {
      console.error("Error during quiz list:", error);
    }
  };

  const openQuiz = async (quizName: string, username: string) => {
    try {
      const endpoint = `/open_quiz`;
      const data = { quizName, username };
      const returnType = ResponseType.JSON;

      const content = await postRequest(endpoint, data, returnType);

      setQuizContent(content);
      setQuizName(quizName);
      setIsInQuiz(true);
    } catch (error) {
      console.error("Error during open_quiz:", error);
    }
  };

  const startQuiz = async (quizName: string, username: string) => {
    try {
      const endpoint = `/start_game`;
      const data = { quizName, username };
      const returnType = ResponseType.TEXT;

      await postRequest(endpoint, data, returnType);

      setCurrentQuestion(1);
    } catch (error) {
      console.error("Error during start_game: ", error);
    }
  };

  return (
    <>
      {(currentQuestion === 0 && (
        <>
          <AppBar className="userAppBar">
            <div className="appBarContent">
              <div className="leftContent">
                <div className="stickTopLeft">
                  <IconButton onClick={() => navigate("/signup")}>
                    <ArrowBackIcon />
                  </IconButton>
                  <IconButton onClick={() => navigate("/")}>
                    <HomeIcon />
                  </IconButton>
                </div>
              </div>

              <h2>Daniel's kahoot - Welcome, {user.username}</h2>
              {!isInQuiz && (
                <>
                  <Link to="/create-game">
                    <button>Create Game</button>
                  </Link>
                </>
              )}
            </div>
          </AppBar>

          {(!isInQuiz && (
            <>
              <h2 className="stickTop">Welcome, {user.username}</h2>

              <Button
                variant="contained"
                onClick={() => {
                  if (!open) {
                    setOpen(!open);
                  }
                  getQuizzes();
                }}
                sx={{ marginBottom: "1rem" }}
              >
                Load Quizzes
              </Button>

              <Collapse in={open} timeout="auto" unmountOnExit>
                <div className="quizScrollContainer">
                  <div className="quizGrid">
                    {Array.from({ length: Math.ceil(quizList.length / 5) }).map(
                      (_, colIndex) => (
                        <div className="quizColumn" key={colIndex}>
                          {quizList
                            .slice(colIndex * 5, colIndex * 5 + 5)
                            .map((quizName, index) => (
                              <div
                                key={index}
                                className="quizItem"
                                onClick={() =>
                                  openQuiz(quizName, user.username)
                                }
                              >
                                {quizName}
                              </div>
                            ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Collapse>

              <br />
              <br />
            </>
          )) || (
            <>
              <h1>
                game code is -{" "}
                {quizContent[0] && "code" in quizContent[0]
                  ? quizContent[0].code
                  : "no code"}
              </h1>
              <br />
              <br />
              <button onClick={() => startQuiz(quizName, user.username)}>
                Start Game
              </button>
            </>
          )}

          <br />
          <br />
          <button onClick={() => setIsInQuiz(!isInQuiz)}>
            change is in quiz mode
          </button>
        </>
      )) || (
        <>
          {quizContent[currentQuestion + 1].question}
          <p>
            1. {quizContent[currentQuestion + 1].answer1} 2.{" "}
            {quizContent[currentQuestion + 1].answer2}
          </p>
        </>
      )}
    </>
  );
}

export default User;
