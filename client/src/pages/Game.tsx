import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./design.css";
import { postRequest, getRequest } from "../api";

function Game() {
  const [gameCode, setGameCode] = useState("");
  const [httpResponse, setHttpResponse] = useState("");

  const intervalRef = useRef<number | null>(null);

  const joinGame = async (gameCode: string) => {
    try {
      const endpoint = `/join_game`;
      const data = { gameCode };

      const content = await postRequest(endpoint, data);

      console.log(content);
      setHttpResponse(content);
    } catch (error) {
      console.error("Error during join_game:", error);
    }
  };

  useEffect(() => {
    if (httpResponse === "True") {
      intervalRef.current = setInterval(async () => {
        const endpoint = `/game_status`;
        const params = `code=${gameCode}`;
        const response = await getRequest(endpoint, params);

        console.log(response)
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameCode, httpResponse]);

  return (
    <>
      {httpResponse !== "True" && (
        <>
          <TextField
            label="game code"
            variant="outlined"
            className="custom-text-field"
            onChange={(e) => setGameCode(e.target.value)}
          />
          <br />
          <br />
          <button onClick={() => joinGame(gameCode)}>Join Game</button>
          <h1>{httpResponse}</h1>
        </>
      )}
    </>
  );
}

export default Game;
