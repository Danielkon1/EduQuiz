import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@mui/material";

function App() {
  return (
    <>
      <p>Select Option</p>
      <Button variant="outlined">
        <a href="/signup">Sign up</a>
      </Button>
      <br />
      <br />
      <Button variant="outlined">
        <a href="/game">Enter Existing Game</a>
      </Button>
    </>
  );
}

export default App;
