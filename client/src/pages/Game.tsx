import { TextField } from "@mui/material";
import { useState } from "react";
import "./design.css"

function Game() {
  const [gameCode, setGameCode] = useState<string>();

  const handleCode = () => {
    console.log(gameCode)
  }

  return (
    <>
      <TextField
        label="enter game code"
        variant="outlined"
        className="custom-text-field"
        onChange={(e) => setGameCode(e.target.value)} />
      <br />
      <br />
      <button onClick={handleCode}>submit</button>
    </>

  );
}

export default Game;
