import "./App.css";
import { AppBar, Button } from "@mui/material";

/**
 * Home page of the app, includes buttons that lead to signup/login page and game participation page
 */
function App() {
  return (
    <>
      <AppBar>
        <div className="appBarContent">
          <img src="/MainLogo.png" className="mainLogo" />
          <h2 className="centerText">Home</h2>
        </div>
      </AppBar>

      <h2>Select Option</h2>

      <button>
        <a href="/signup">Signup/Login</a>
      </button>
      <br />
      <br />
      <button>
        <a href="/game">Enter Existing Game</a>
      </button>
    </>
  );
}

export default App;
