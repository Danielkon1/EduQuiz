import { AppBar, Button, Collapse, IconButton } from "@mui/material";
import { user } from "./Signup";
import { useState } from "react";
import "./design.css";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { postRequest, getRequest } from "../api";

function User() {
  const navigate = useNavigate();

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
  const [gameCode, setGameCode] = useState("")
  const [quizContent, setQuizContent] = useState<QuizQuestion[]>(
    []
  );

  const getQuizzes = async () => {
    const endpoint = `/quiz_list`;
    const params = `username=${user.username}`;
    const response = await getRequest(endpoint, params);

    setQuizList(response);
  };

  const openQuiz = async (quizName: string, username: string) => {
    try {
      const endpoint = `/open_quiz`;
      const data = { quizName, username };

      const content = await postRequest(endpoint, data);
      
      console.log(content)
      setGameCode(content[0].code)
      const slicedContent = content.slice(1)
      setQuizContent(slicedContent);
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

      await postRequest(endpoint, data);

      setCurrentQuestion(1);
    } catch (error) {
      console.error("Error during start_game: ", error);
    }
  };

  const nextQuestion = async () => {
    try {
      const endpoint = `/next_question`;
      const username = user.username
      const data = { quizName, username }

      await postRequest(endpoint, data);

      setCurrentQuestion(currentQuestion + 1);
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
                game code is - {gameCode}
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
          <h1>{quizContent[currentQuestion - 1].question}</h1>

          <h2 className="question1">1 - {quizContent[currentQuestion - 1].answer1}</h2>
          <h2 className="question2">2 - {quizContent[currentQuestion - 1].answer2}</h2>
          <h2 className="question3">3 - {quizContent[currentQuestion - 1].answer3}</h2>
          <h2 className="question4">4 - {quizContent[currentQuestion - 1].answer4}</h2>

          <button onClick={() => nextQuestion()}>Next Question</button>
          
        </>
      )}
    </>
  );
}

export default User;
