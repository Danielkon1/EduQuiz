import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./design.css";
import { postRequest, ResponseType } from "../api";

function Game() {
  const [gameCode, setGameCode] = useState("");
  const [httpResponse, setHttpResponse] = useState("");

  const intervalRef = useRef<number | null>(null);

  const joinGame = async (gameCode: string) => {
    try {
      const endpoint = `/join_game`;
      const data = { gameCode };
      const returnType = ResponseType.TEXT;

      const content = await postRequest(endpoint, data, returnType)

      setHttpResponse(content);
    } catch (error) {
      console.error("Error during join_game:", error);
    }
  };

  useEffect(() => {
    if (httpResponse === "True") {
      intervalRef.current = setInterval(async () => {
        const endpoint = `/game_status?code=${encodeURIComponent(gameCode)}`;
        try {
          const response = await fetch(`http://localhost:4443${endpoint}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const status = response.status;
          console.log("status - " + status.toString());
          const text = await response.text();
          console.log(text);
        } catch (error) {
          console.error("Error during quiz list:", error);
        }
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
