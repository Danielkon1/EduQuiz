import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { correctPassword, correctUsername } from "./SignUp";
import { useState } from "react";
import "./design.css";
import { Link } from "react-router-dom";

function User() {
  const [open, setOpen] = useState(false);
  const [quizList, setQuizList] = useState([]);

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
      setQuizList(text)

    } catch (error) {
      console.error("Error during quiz list:", error);
    }
  };

  return (
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
                onClick={() => console.log(`Selected quiz: ${quizName}`)}
              >
                <ListItemText primary={quizName} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </>
  );
}

export default User;
