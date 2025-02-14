import { TextField } from "@mui/material";
import "./design.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../api"; // Import login and signup functions

export var correctUserName: string | null = null;
export var correctPassword: string | null = null;

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

      navigate("/User"); // Navigate to the User page after successful login/signup
    }
  }, [message, username, password, navigate]); // Added dependencies to avoid potential stale closures

  const handleSignUp = async (type: "login" | "signup") => {
    let response;

    if (type === "login") {
      response = await login(username, password); // Use the login function from api.ts
    } else {
      response = await signup(username, password); // Use the signup function from api.ts
    }

    setMessage(response.message);
  };

  return (
    <>
      <p>Enter fields</p>

      <TextField
        label="Username"
        variant="outlined"
        className="custom-text-field"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <br />
      <TextField
        label="Password"
        variant="outlined"
        className="custom-text-field"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <div className="padButtons">
        <button onClick={() => handleSignUp("login")}>Log In</button>
        <button onClick={() => handleSignUp("signup")}>Sign Up</button>
      </div>
      {message && <p>{message}</p>}
    </>
  );
}

export default SignUp;
