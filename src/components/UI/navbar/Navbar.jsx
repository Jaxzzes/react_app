import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MyButton from "../button/MyButton";
import { AuthContext } from "../../../context";

const Navbar = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem('auth')
    }

    return (
        <div className="navbar">
            <MyButton onClick={logout}>
                Exit
            </MyButton>
            <div className="navbar__links">
                <div><Link to="/about"><MyButton>About</MyButton></Link></div>
                <div><Link to="/posts"><MyButton>Posts</MyButton></Link></div>
            </div>
        </div>
    );
};

export default Navbar;