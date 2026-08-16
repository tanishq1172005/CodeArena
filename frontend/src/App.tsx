import "./index.css";
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'
import Register from "./pages/Register";
import Login from "./pages/Login";
import Questions from "./pages/Questions";
import Submission from "./pages/Submission";
import {Toaster} from 'react-hot-toast'
import Landing from "./pages/Landing";
export function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Landing/>}/>
        <Route path="/submission" element={<Submission/>}/>
        <Route path="/questions" element={<Questions/>}/>
      </Routes>
    </Router>

    <Toaster 
    position="bottom-right"
    />
    </>
  );
}

export default App;
