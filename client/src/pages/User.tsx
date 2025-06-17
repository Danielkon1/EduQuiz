import { AppBar, Button, Collapse, Dialog, IconButton } from "@mui/material";
import { user } from "./Signup";
import { useEffect, useRef, useState } from "react";
import "./design.css";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { postRequest, getRequest } from "../api";
export type QuizQuestion = {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correct: string;
};

function User() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [open, setOpen] = useState(false);
  const [isInQuiz, setIsInQuiz] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameCode, setGameCode] = useState("");
  const [quizContent, setQuizContent] = useState<QuizQuestion[]>([]);
  const [winner, setWinner] = useState("");
  const [isDialogPopUpOpen, setIsDialogPopUpOpen] = useState(false);

  const getRandomInGameSong = () => {
    return `InGame${Math.floor(Math.random() * 3 + 1)}.mp3`;
  };

  useEffect(() => {
    if (user.username === "" || user.password === "") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    let src = "";
    if (currentQuestion === 0 && isInQuiz) {
      src = "/music/LobbyMusic.mp3";
    } else if (
      currentQuestion > 0 &&
      currentQuestion < quizContent.length + 1
    ) {
      src = `/music/${getRandomInGameSong()}`;
    } else if (currentQuestion >= quizContent.length + 1 && winner === "") {
      src = "/music/LobbyMusic.mp3";
    } else if (winner !== "") {
      src = "/music/Winner.mp3";
    }
    if (audioRef.current) {
      if (audioRef.current.src !== window.location.origin + src) {
        audioRef.current.src = src;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentQuestion, isInQuiz, quizContent.length, winner]);

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

      setGameCode(content[0].code);
      const slicedContent = content.slice(1);
      setQuizContent(slicedContent);
      setQuizName(quizName);
      setIsInQuiz(true);
    } catch (error) {
      console.error("Error during open_quiz:", error);
    }
  };

  const deleteQuiz = async (quizName: string, username: string) => {
    try {
      const endpoint = `/delete_quiz`;
      const data = { quizName, username };

      await postRequest(endpoint, data);
    } catch (error) {
      console.error("Error during open_quiz:", error);
    }
  };

  const startQuiz = async (
    quizName: string,
    username: string,
    firstAnswer: string
  ) => {
    try {
      const endpoint = `/start_game`;

      const data = { quizName, username, firstAnswer };

      await postRequest(endpoint, data);

      setCurrentQuestion(1);
    } catch (error) {
      console.error("Error during start_game: ", error);
    }
  };

  const nextQuestion = async (currentQuestionObject: QuizQuestion) => {
    try {
      if (typeof currentQuestionObject != "undefined") {
        const endpoint = `/next_question`;
        const username = user.username;
        const currentAnswer = currentQuestionObject.correct;
        const data = { quizName, username, currentAnswer };

        await postRequest(endpoint, data);
      }

      setCurrentQuestion(currentQuestion + 1);
    } catch (error) {
      console.error("Error during start_game: ", error);
    }
  };

  const fetchResults = async () => {
    try {
      const endpoint = `/fetch_results`;
      const params = `gameCode=${gameCode}`;
      const response = await getRequest(endpoint, params);

      setWinner(response);
    } catch (error) {
      console.error("Error during fetch_results: ", error);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop hidden />
      {(currentQuestion === 0 && (
        <>
          <AppBar className="userAppBar">
            <div className="appBarContent">
              <img src="/MainLogo.png" className="mainLogo" />
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

              <h2>Welcome, {user.username}</h2>
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
                                onClick={() => {
                                  setIsDialogPopUpOpen(true);
                                  setQuizName(quizName);
                                }}
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

              <Dialog
                open={isDialogPopUpOpen}
                onClose={() => setIsDialogPopUpOpen(false)}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: "#2e2e2e",
                      borderRadius: 2,
                      padding: 3,
                      color: "white",
                    },
                  },
                }}
              >
                <div className="gridDialog">
                  <button onClick={() => openQuiz(quizName, user.username)}>
                    Start Quiz
                  </button>
                  <br />
                  <button
                    onClick={() => {
                      deleteQuiz(quizName, user.username);
                      setIsDialogPopUpOpen(false);
                    }}
                  >
                    Delete Quiz
                  </button>
                </div>
              </Dialog>

              <br />
              <br />
            </>
          )) || (
            <>
              <h1>game code is - {gameCode}</h1>
              <br />
              <br />
              <button
                onClick={() =>
                  startQuiz(quizName, user.username, quizContent[0].correct)
                }
              >
                Start Game
              </button>
            </>
          )}
        </>
      )) ||
        (currentQuestion < quizContent.length + 1 && (
          <>
            <h1>{quizContent[currentQuestion - 1].question}</h1>

            <h2 className="question1">
              1 - {quizContent[currentQuestion - 1].answer1}
            </h2>
            <h2 className="question2">
              2 - {quizContent[currentQuestion - 1].answer2}
            </h2>
            <h2 className="question3">
              3 - {quizContent[currentQuestion - 1].answer3}
            </h2>
            <h2 className="question4">
              4 - {quizContent[currentQuestion - 1].answer4}
            </h2>

            <button
              onClick={() => {
                nextQuestion(quizContent[currentQuestion]);
              }}
            >
              Next Question
            </button>
          </>
        )) || (
          <>
            {(winner === "" && (
              <>
                <h1>Finished quiz, please wait for results.</h1>
                <button onClick={fetchResults}>fetch results</button>
              </>
            )) || (
              <>
                <h1>winner is: {winner}</h1>
                <button
                  onClick={() => {
                    setWinner("");
                    setCurrentQuestion(0);
                    setIsInQuiz(false);
                  }}
                >
                  back to user page
                </button>
              </>
            )}
          </>
        )}
    </>
  );
}

export default User;
