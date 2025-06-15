import { AppBar, TextField } from "@mui/material";
import "./design.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api";

export const user = {
  username: "daniel",
  password: "daniel1",
};

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRequest = async (mode: "signup" | "login") => {
    try {
      const endpoint = mode === "signup" ? "/add_user" : "/login";
      const data = { username, password };

      await postRequest(endpoint, data);

      user.username = username;
      user.password = password;

      navigate("/User");
    } catch (error) {
      alert(`Error during sign-up/login: ${error}`);
    }
  };

  const isUsingSmallScreen = () => {
    return window.innerWidth < 768;
  };

  useEffect(() => {
    if (isUsingSmallScreen()) {
      alert("The following pages are recommended to be used from a device with a larger screen (not phone)");
    }
  }, []);

  return (
    <>
      <AppBar>
        <h2>EduQuiz - Signup/login</h2>
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
          <button onClick={() => handleRequest("login")}>Log In</button>
          <button onClick={() => handleRequest("signup")}>Sign Up</button>
        </div>
      </div>
    </>
  );
}

export default SignUp;
