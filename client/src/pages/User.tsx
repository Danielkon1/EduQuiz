import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { correctPassword, correctUsername } from "./SignUp";
import { useState } from "react";
import "./design.css";
import { Link } from "react-router-dom";

function User() {
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
    const endpoint = `/quiz_list?username=${encodeURIComponent(
      correctUsername
    )}`;
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

  return (
    <>
      {(!isInQuiz && (
        <>
          <h3>Welcome, {correctUsername}</h3>
          <Link to={"/create-game"}>
            <button>Create Game</button>
          </Link>
          <p>
            password: {correctPassword}, userName: {correctUsername}
          </p>
          <List className="ListItemButton">
            <ListItemButton
              className="ListItemButtonTwo"
              onClick={() => setOpen(!open)}
            >
              <ListItemText primary="open quizzes" onClick={getQuizzes} />
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List disablePadding>
                {quizList.map((quizName, index) => (
                  <ListItemButton
                    key={index}
                    className="ListItemButtonTwo"
                    onClick={() => {
                      // console.log(`Selected quiz: ${quizName}`);
                      startQuiz(quizName, correctUsername);
                    }}
                  >
                    <ListItemText primary={quizName} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
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

      <button onClick={() => setIsInQuiz(!isInQuiz)}>
        change is in quiz mode
      </button>
    </>
  );
}

export default User;
