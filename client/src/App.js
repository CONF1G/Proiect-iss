import { BrowserRouter, Routes, Route } from "react-router-dom";
import Books from "./pages/Books";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import AdminStore from "./pages/AdminPage";
import PlaceOrder from "./pages/PlaceOrder";
import "./style.css"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/store" element={<AdminStore />} />
          <Route path="/place-order" element={<PlaceOrder />} />;
          <Route path="/add" element={<Add />} />
          <Route path="/update/:id" element={<Update />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
