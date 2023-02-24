import { Route } from "react-router-dom";
import "./App.css";
import Chat from "./Pages/Chat";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact />
      <Route path="/chats" exact component={Chat} />
    </div>
  );
}

export default App;
