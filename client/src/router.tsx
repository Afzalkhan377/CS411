import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import AI from "./pages/AI";
import Spotify from "./pages/Spotify";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
       <Route path = "/" element={<Home />} />
       <Route path = "/register" element={<Registration />} />
       <Route path = "/ai" element={<AI/>} />
       <Route path = "/spotify-auth" element={<Spotify />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;