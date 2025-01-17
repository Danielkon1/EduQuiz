import { TextField } from "@mui/material";
import "./design.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export var correctUserName: "" | string;
export var correctPassword: "" | string;

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      message === "Login successful!" ||
      message === "User registered successfully."
    ) {
      correctUserName = username;
      correctPassword = password;

      navigate("/User");
    }
  }, [message]);

  const handleSignUp = async (type: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/" + type, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <>
      <p>enter fields</p>

      <TextField
        label="username"
        variant="outlined"
        className="custom-text-field"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <br />
      <TextField
        label="password"
        variant="outlined"
        className="custom-text-field"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <div className="padButtons">
        <button onClick={() => handleSignUp("login")}>Log In</button>
        <button onClick={() => handleSignUp("signup")}>Sign Up</button>
      </div>
      <p>{message}</p>
    </>
  );
}

export default SignUp;
