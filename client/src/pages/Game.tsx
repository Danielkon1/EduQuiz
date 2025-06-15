import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./design.css";
import { postRequest, getRequest } from "../api";
import { useNavigate } from "react-router-dom";

function Game() {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState("");
  const [httpResponse, setHttpResponse] = useState("");
  const [currentScore, setCurrentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(-1);
  const [intervalContinueFlag, setIntervalContinueFlag] = useState(true);
  const [nickname, setNickname] = useState("");
  const [hasQuestionChanged, setHasQuestionChanged] = useState(true);

  const intervalRef = useRef<number | null>(null);

  const joinGame = async (gameCode: string) => {
    try {
      const endpoint = `/join_game`;
      const data = { gameCode };

      const content = await postRequest(endpoint, data);

      setHttpResponse(content);
    } catch (error) {
      console.error("Error during join_game:", error);
    }
  };

  useEffect(() => {
    if (httpResponse === "True" && intervalContinueFlag) {
      intervalRef.current = setInterval(async () => {
        const endpoint = `/game_status`;
        const params = `code=${gameCode}`;
        const response = await getRequest(endpoint, params);

        if (Number(response) !== currentQuestion) {
          setHasQuestionChanged(true);
        }
        setCurrentQuestion(Number(response));
      }, 500);
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
  }, [currentQuestion, gameCode, httpResponse, intervalContinueFlag]);

  const submitAnswer = async (gameCode: string, currentAnswer: number) => {
    try {
      if (hasQuestionChanged) {
        const endpoint = `/answer_question`;
        const current_answer = String(currentAnswer);
        const data = { gameCode, current_answer };

        const response = await postRequest(endpoint, data);
        setCurrentScore(currentScore + Number(response));
        setHasQuestionChanged(false);
      }
    } catch (error) {
      console.error("Error during answer_question:", error);
    }
  };
  const submitResults = async (
    gameCode: string,
    score: string,
    name: string
  ) => {
    try {
      const endpoint = `/submit_results`;
      const data = { gameCode, score, name };

      await postRequest(endpoint, data);
      setIntervalContinueFlag(false);
      navigate("/");
    } catch (error) {
      console.error("Error during submit_results:", error);
    }
  };
  return (
    <>
      {(httpResponse !== "True" && (
        <>
          <TextField
            label="game code"
            variant="outlined"
            className="custom-text-field"
            onChange={(e) => setGameCode(e.target.value)}
          />
          <br />
          <br />
          <TextField
            label="nickname"
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
        (currentQuestion >= 1 && (
          <>
            <h2>current question: {currentQuestion}</h2>
            <h2>current score: {currentScore}</h2>
            <br />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
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
              submit results / leave quiz
            </button>
          </>
        )) || (
          <>
            <h1>Waiting for host to start the game</h1>
          </>
        )}
    </>
  );
}

export default Game;
