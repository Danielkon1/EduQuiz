import {
  AppBar,
  Collapse,
  Grid2,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { user } from "./Signup";
import { useState } from "react";
import "./design.css";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";

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

      const status = response.status;
      console.log("status - " + status.toString());
      const text = await response.json();
      console.log(typeof text);
      setQuizList(text);
    } catch (error) {
      console.error("Error during quiz list:", error);
    }
  };

  const startQuiz = async (quizName: string, username: string) => {
    const endpoint = `/start_quiz`;
    try {
      const response = await fetch(`http://localhost:4443${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizName,
          username,
        }),
      });

      const status = response.status;
      console.log("status - " + status);
      const text = await response.json();
      setQuizContent(text);
      console.log(quizContent);
      setIsInQuiz(true);
    } catch (error) {
      console.error("Error during start_quiz:", error);
      // setMessage("Error connecting to the server.");
    }
  };

  // TODO: delete
  // useEffect(() => {
  //   Signup.correctUsername = "daniel";
  // }, []);

  return (
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

          <Link to="/create-game">
            <button>Create Game</button>
          </Link>
        </div>
      </AppBar>


      {(!isInQuiz && (
        <>
          <h2 className="stickTop">Welcome, {user.username}</h2>
          <List className="ListItemButton">
            <ListItemButton
              onClick={() => setOpen(!open)}
            >
              <ListItemText primary="open quizzes" onClick={getQuizzes} sx={{ color: "#E0E0E0" }}/>
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List disablePadding>
                {quizList.map((quizName, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => {
                      // console.log(`Selected quiz: ${quizName}`);
                      startQuiz(quizName, user.username);
                    }}
                  >
                    <ListItemText primary={quizName} sx={{ color: "#E0E0E0" }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
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
        </>
      )}

      <br />
      <br />
      <button onClick={() => setIsInQuiz(!isInQuiz)}>
        change is in quiz mode
      </button>
    </>
  );
}

export default User;
