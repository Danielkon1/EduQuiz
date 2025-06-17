import "./App.css";
import { AppBar, Button } from "@mui/material";

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
