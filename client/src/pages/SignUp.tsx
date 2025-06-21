import { AppBar, TextField } from "@mui/material";
import "./design.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../api";
import { sha256 } from "../config";

// Global user object to store login session data
export const user = {
  username: "",
  password: "",
};

function SignUp() {
  // Local state for username and password input fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Disallowed usernames and passwords (basic validation)
  const unallowedUserNames = ["", "users"];
  const unallowedPasswords = [""];

  // Handles both signup and login logic
  const handleRequest = async (mode: "signup" | "login") => {
    try {
      const isUsernameNotAllowed = unallowedUserNames.includes(username);
      const isPasswordNotAllowed = unallowedPasswords.includes(password);

      // Validate inputs before making a request
      if (isUsernameNotAllowed && isPasswordNotAllowed) {
        throw new Error("Both username and password are not allowed");
      } else if (isUsernameNotAllowed) {
        throw new Error("Username not allowed");
      } else if (isPasswordNotAllowed) {
        throw new Error("Password not allowed");
      }

      // Hash password before sending
      const hashedPass = await sha256(password);

      // Determine correct endpoint based on mode
      const endpoint = mode === "signup" ? "/add_user" : "/login";
      const data = { username, hashedPass };

      // Send the request
      await postRequest(endpoint, data);

      // Store user data in global object
      user.username = username;
      user.password = hashedPass;

      // Redirect to user page
      navigate("/User");
    } catch (error) {
      alert(`Error during sign-up/login: ${error}`);
    }
  };

  // Simple screen-size check (used once on load)
  const isUsingSmallScreen = () => {
    return window.innerWidth < 768;
  };

  // Warn users if on small screen (mobile)
  useEffect(() => {
    if (isUsingSmallScreen()) {
      alert(
        "The following pages are recommended to be used from a device with a larger screen"
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
        <p>Enter Fields</p>

        {/* Username input */}
        <TextField
          label="Username"
          variant="outlined"
          className="custom-text-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />

        {/* Password input */}
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

        {/* Buttons for login/signup */}
        <div className="padButtons">
          <button onClick={() => handleRequest("login")}>Log In</button>
          <button onClick={() => handleRequest("signup")}>Sign Up</button>
        </div>
      </div>
    </>
  );
}

export default SignUp;
