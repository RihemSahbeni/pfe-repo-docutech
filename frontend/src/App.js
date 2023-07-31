import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import AddUser from "./Components/UserService/AddUser";
import HomeDoc from "./Components/PageW/DocHome";
import Navigator from "./Components/Navbar/Navigator";
import Dashboard from "./Components/PageW/Dashboard";
import Home from "./Components/PageW/Home";
import History from "./Components/PageW/History";
import HomeProject from "./Components/PageW/HomeProject";
import HomeProjectForUser from "./Components/PageW/HomeProjectForUser";
import Login from "./Components/Authetification/Login";
import Register from "./Components/Authetification/Register";
import Ressetpassword from "./Components/Authetification/Ressetpassword";
import VerificationCode from "./Components/Authetification/VerificationCode";
import "bootstrap/dist/css/bootstrap.min.css";
import "rsuite/dist/rsuite.min.css";
import Error from "./Components/Erreur/Error";
import NotFound from "./Components/Erreur/NotFound";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import LimitAccesRoute from "./Components/PrivateRoute/LimitAccesRoute";
import Profile from "./Components/UserService/Profile";
import AddProject from "./Components/ProjectService/AddProject";
import Model from "./Components/Generator/Model";
import ModelHome from "./Components/PageW/ModelHome";
import MyDocHome from "./Components/PageW/MyDocHome";
import AddDoc from"./Components/Document/AddDoc";
import AddModel from"./Components/Document/AddModel";
import DocsParProject from "./Components/Document/DocsParProject";
import Converter from "./Components/Converter/Conterver";
import { useState } from "react";
function App() {
  const [navbarIsOpen,setnavbarIsOpen]=useState(true);
  function closenavbar(){
    setnavbarIsOpen(false);
  }
  const token = localStorage.getItem("token");
  return (
    <div className="App">
      {navbarIsOpen&& <Navigator />}
      <Routes>
        {/* Redirect the path to dashboard component */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
           <Route
          path="/Profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      


<>
<Route path="/createproject" element={<PrivateRoute><AddProject /> </PrivateRoute>} />
<Route path="/createmodel" element={<PrivateRoute><AddModel /> </PrivateRoute>} />
<Route path="/createdoc" element={<PrivateRoute><AddDoc /> </PrivateRoute>} />
 <Route path="/adduser" element={<LimitAccesRoute><AddUser /></LimitAccesRoute>} />
  <Route path="/home" element={<LimitAccesRoute><Home /></LimitAccesRoute>} />
  <Route path="/homeProject" element={<PrivateRoute><HomeProject /></PrivateRoute>} />
  <Route path="/homeMyProject" element={<PrivateRoute><HomeProjectForUser /></PrivateRoute>} />
  <Route path="/ConfigurerModel" element={<PrivateRoute><Model notifParentaboutnavbar={setnavbarIsOpen} /></PrivateRoute>} />
  <Route path="/ConfigurerDoc" element={<PrivateRoute><Model notifParentaboutnavbar={setnavbarIsOpen} /></PrivateRoute>} />

  <Route path="/homeDoc" element={<LimitAccesRoute><HomeDoc /></LimitAccesRoute>} />
  <Route path="/History" element={<PrivateRoute><History /></PrivateRoute>} />
  <Route path="/ModelHome" element={<PrivateRoute><ModelHome /></PrivateRoute>} />
  <Route path="/MyDocHome" element={<PrivateRoute><MyDocHome /></PrivateRoute>} />
  <Route path="/DocsParProjet" element={<PrivateRoute><DocsParProject /></PrivateRoute>}/>
</>
       
      
        <Route path="/Converter" element={<Converter />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Createpass" element={<Ressetpassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/VerificationCode" element={<VerificationCode/>} />
        <Route path="/ResetPassword" element={<resetPassword />} />
        <Route path="/error" element={<Error />} />
       <Route path="*" element={<NotFound />} />
       </Routes>
    </div>
  );
}

export default App;
