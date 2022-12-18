import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom"
import Auth from "./components/Auth";
import { UserContext } from "./context/UserProvider";
import Navbar from "./components/Navbar";

export default function App() {

    const {user: {username}} = React.useContext(UserContext)

    return (
        <div className="app">
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={<Auth />}
                />
            </Routes>
            <h1>App component {username}</h1>

        </div>
    )
}