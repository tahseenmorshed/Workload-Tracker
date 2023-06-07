// Uses React Bootstrap 5.2 - https://react-bootstrap.github.io/
// Uses MUI libraries - https://mui.com/

import { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Topbar from "./mainpages/Bars/Topbar";
import Sidebar from "./mainpages/Bars/Sidebar";
import AdminStaffPage from "./mainpages/AdminStaffPage/MainStaffPage";
import AdminUnitPage from "./mainpages/AdminUnitPage/MainUnitPage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMode } from "./theme";
import CRUDTable from "./mainpages/UnitPages/MainTable";
import "./index.css"
import { BrowserRouter as Router } from "react-router-dom";
import RouteRenderer from "./components/RouteRenderer";
import {useNavigate} from 'react-router-dom'
import AuthContext from "./components/AuthContext";
import { useContext } from "react";


function App() {
  const [theme] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const {token, setToken} = useContext(AuthContext);
  const [isAppClosing, setIsAppClosing] = useState(false);

  /*Clears the token from memory when the tab/window is closed */
  useEffect(() => {
    const clearTokenOnClose = (event) => {
      if (isAppClosing) {
        localStorage.removeItem('token');
      }
    };
  
    window.addEventListener('beforeunload', clearTokenOnClose);
  
    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeunload', clearTokenOnClose);
    };
  }, [isAppClosing]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsAppClosing(true);
      } else {
        setIsAppClosing(false);
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token from local storage
    setToken(null);  // Update the token state in AuthContext
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          {token && <Sidebar onLogout={handleLogout}/>}
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <RouteRenderer />
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;