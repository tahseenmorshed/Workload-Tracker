import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Login from "./mainpages/LoginPage/Login";
import App from "./App";
import { BrowserRouter, Route } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import TestPage from "./mainpages/TestPage";
import { AuthProvider } from "./components/AuthContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AuthProvider>
              <App/>
            </AuthProvider>);