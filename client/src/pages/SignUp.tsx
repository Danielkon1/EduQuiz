import { AppBar, TextField } from "@mui/material";
import "./design.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api";
import { sha256 } from "../config";

export const user = {
  username: "",
  password: "",
};

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const unallowedUserNames = ["", "users"];
  const unallowedPasswords = [""];

  const handleRequest = async (mode: "signup" | "login") => {
    try {
      const isUsernameNotAllowed = unallowedUserNames.includes(username);
      const isPasswordNotAllowed = unallowedPasswords.includes(password);
      if (isUsernameNotAllowed && isPasswordNotAllowed) {
        throw new Error("Both username and password are not allowed");
      } else if (isUsernameNotAllowed) {
        throw new Error("Username not allowed");
      } else if (isPasswordNotAllowed) {
        throw new Error("Password not allowed");
      }
      const hashedPass = await sha256(password);
      const endpoint = mode === "signup" ? "/add_user" : "/login";
      
      const data = { username, hashedPass };

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
      alert(
        "The following pages are recommended to be used from a device with a larger screen (not phone)"
      );
    }
  }, []);

  return (
    <>
      <AppBar>
        <div className="appBarContent">
          <img src="/MainLogo.png" className="mainLogo" />
          <h2 className="centerText">Signup/Login</h2>
        </div>
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
