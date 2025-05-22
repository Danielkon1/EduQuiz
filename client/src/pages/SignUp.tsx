import { AppBar, TextField } from "@mui/material";
import "./design.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest, ResponseType } from "../api";


export const user = {
  username: "DefaultUser",
  password: "DefaultPassword"
}

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [httpStatus, setHttpStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (httpStatus === "200") {
      user.username = username;
      user.password = password

      navigate("/User");
    }
  }, [message, httpStatus, username, password, navigate]);

  const handleSignUp = async (mode: "signup" | "login") => {
    try {
      const endpoint = mode === "signup" ? "/add_user" : "/login";
      const data = { username, password };
      const returnType = ResponseType.TEXT;

      const content = await postRequest(endpoint, data, returnType)

      setHttpStatus("200");
      setMessage(content);
    } catch (error) {
      console.error("Error during sign-up/login:", error);
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <>
      <AppBar>
        <h2>Daniel's kahoot - Signup/login</h2>
      </AppBar>
      <div className="signupPageCard">

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
      </div>
    </>
  );
}

export default SignUp;
