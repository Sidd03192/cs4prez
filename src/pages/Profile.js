import React, { useState, useEffect, useRef } from 'react';
import "../styles/App.css";
import Login from "../img/Login.png";
import user from '../img/user.png';
import edit from '../img/edit.png';
import inbox from '../img/envelope.png';
import settings from '../img/settings.png';
import help from '../img/question.png';
import logoutImg from '../img/log-out.png'; // Renamed to avoid conflict
import Cookies from "universal-cookie";
import { getAuth, signOut } from "firebase/auth";
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom"; // Import Link from React Router

const cookies = new Cookies();

export const Profile = (props) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
console.log(props.name +"in profile");
  const toggle = () => {
    setOpen(!open);
  }

  const login = () => {
    return <Navigate to="/Auth" />;
  }

 const logoutHandler = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setIsAuth(null); // Set isAuth to null after successful sign-out
      cookies.remove("auth-token"); // Remove the auth token cookie
    }).catch((error) => {
      // Handle sign-out error
    });
  }

  if (!isAuth) {
    return (
      <div className='profile'>
        <div className='menu-container'>
          <div className='menu-trigger'>
            <img onClick={toggle} src={Login} alt={Login} className='loginglow'/>
          </div>
          <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} ref={menuRef}>
            <ul>
              <DropdownItem onClick={login} img={user} text={"Login"} page={"/Auth"} />
            </ul>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='profile'>
        <div className='menu-container'>
          <div className= {isAuth ? 'menu-trigger':"loginglow"}>
            <img onClick={toggle} src={props.photo} alt={Login} />
          </div>
          <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} ref={menuRef}>
            <h3>{props.name} <br /><span>{props.email}</span></h3>
            <ul>
              <DropdownItem img={user} text={"My Profile"} />
              <DropdownItem img={edit} text={"Edit Profile"} />
              <DropdownItem img={inbox} text={"Inbox"} />
              <DropdownItem img={settings} text={"Settings"} />
              <DropdownItem img={help} text={"Help"} />
              <DropdownItem img={logoutImg} text={"Logout"} onClick={logoutHandler} />
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const DropdownItem = ({ img, text, page, onClick }) => {
  return (
    <li className="dropdownItem">
      <img src={img} alt={text} />
      <Link to={page} onClick={onClick}>{text}</Link>
    </li>
  );
};
