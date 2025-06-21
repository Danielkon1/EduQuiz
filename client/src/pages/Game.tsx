import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./design.css";
import { postRequest, getRequest } from "../api";
import { useNavigate } from "react-router-dom";

function Game() {
  const navigate = useNavigate();

  // State for form inputs and gameplay
  const [gameCode, setGameCode] = useState("");
  const [httpResponse, setHttpResponse] = useState(""); // Result of join request
  const [currentScore, setCurrentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(-1);
  const [intervalContinueFlag, setIntervalContinueFlag] = useState(true);
  const [nickname, setNickname] = useState("");
  const [hasQuestionChanged, setHasQuestionChanged] = useState(true);

  // Ref to store the polling interval ID
  const intervalRef = useRef<number | null>(null);

  // Try to join the game using the game code
  const joinGame = async (gameCode: string) => {
    try {
      const endpoint = `/join_game`;
      const data = { gameCode };

      const content = await postRequest(endpoint, data);
      setHttpResponse(content); // Expecting "True" or error message
    } catch (error) {
      console.error("Error during join_game:", error);
    }
  };

  // Poll server for the current question number
  useEffect(() => {
    if (httpResponse === "True" && intervalContinueFlag) {
      intervalRef.current = window.setInterval(async () => {
        const endpoint = `/game_status`;
        const params = `code=${gameCode}`;
        const response = await getRequest(endpoint, params);

        if (Number(response) !== currentQuestion) {
          setHasQuestionChanged(true); // Enable answering if question has changed
        }
        setCurrentQuestion(Number(response));
      }, 200); // Poll every 200ms
    } else {
      // Clear interval if game is not active
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentQuestion, gameCode, httpResponse, intervalContinueFlag]);

  // Submit an answer if question has changed
  const submitAnswer = async (gameCode: string, currentAnswer: number) => {
    try {
      if (hasQuestionChanged) {
        const endpoint = `/answer_question`;
        const current_answer = String(currentAnswer);
        const data = { gameCode, current_answer };

        const response = await postRequest(endpoint, data);
        setCurrentScore(currentScore + Number(response));
        setHasQuestionChanged(false); // Disable further answers until question changes
      }
    } catch (error) {
      console.error("Error during answer_question:", error);
    }
  };

  // Submit final score and navigate home
  const submitResults = async (
    gameCode: string,
    score: string,
    name: string
  ) => {
    try {
      const endpoint = `/submit_results`;
      const data = { gameCode, score, name };

      await postRequest(endpoint, data);
      setIntervalContinueFlag(false); // Stop polling
      navigate("/");
    } catch (error) {
      console.error("Error during submit_results:", error);
    }
  };

  return (
    <>
      {/* Game Join Screen */}
      {(httpResponse !== "True" && (
        <>
          <TextField
            label="Game Code"
            variant="outlined"
            className="custom-text-field"
            onChange={(e) => setGameCode(e.target.value)}
          />
          <br />
          <br />
          <TextField
            label="Nickname"
            variant="outlined"
            className="custom-text-field"
            onChange={(e) => setNickname(e.target.value)}
          />
          <br />
          <br />
          <button onClick={() => joinGame(gameCode)}>Join Game</button>
          <h1>{httpResponse}</h1>
        </>
      )) ||

        // Quiz Screen (if question has started)
        (currentQuestion >= 1 && (
          <>
            <h2>Current Question: {currentQuestion}</h2>
            <h2>Current Score: {currentScore}</h2>
            <br />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {/* Answer buttons (1-4) */}
              <button
                className={hasQuestionChanged ? "answer1" : "disabledAnswer1"}
                disabled={!hasQuestionChanged}
                onClick={() => submitAnswer(gameCode, 1)}
              >
                1
              </button>
              <button
                className={hasQuestionChanged ? "answer2" : "disabledAnswer2"}
                disabled={!hasQuestionChanged}
                onClick={() => submitAnswer(gameCode, 2)}
              >
                2
              </button>
              <button
                className={hasQuestionChanged ? "answer3" : "disabledAnswer3"}
                disabled={!hasQuestionChanged}
                onClick={() => submitAnswer(gameCode, 3)}
              >
                3
              </button>
              <button
                className={hasQuestionChanged ? "answer4" : "disabledAnswer4"}
                disabled={!hasQuestionChanged}
                onClick={() => submitAnswer(gameCode, 4)}
              >
                4
              </button>
            </div>

            <br />
            <br />
            <button
              onClick={() =>
                submitResults(gameCode, String(currentScore), nickname)
              }
            >
              Submit Results / Leave Quiz
            </button>
          </>
        )) ||

        // Waiting for host to start the game
        (
          <>
            <h1>Waiting For Host to Start The Game</h1>
          </>
        )}
    </>
  );
}

export default Game;
