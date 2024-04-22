import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;