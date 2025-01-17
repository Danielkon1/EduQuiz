import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { correctPassword, correctUserName } from "./SignUp";
import { useState } from "react";
import "./design.css";
import { Link } from "react-router-dom";

function User() {
  const [open, setOpen] = useState(false);
  const userName = "daniel";
  return (
    <>
      <h3>Welcome, {userName}</h3>
      <Link to={'/create-game'}><button>Create Game</button></Link>
      <p>
        password: {correctPassword}, userName: {correctUserName}
      </p>
      <List className="ListItemButton">
        <ListItemButton
          className="ListItemButtonTwo"
          onClick={() => setOpen(!open)}
        >
          <ListItemText primary="open quizzes" />
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            <ListItemButton className="ListItemButtonTwo">
              <ListItemText primary="daniel" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </>
  );
}

export default User;
