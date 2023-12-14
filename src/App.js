import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth, db } from "./firebase"; // Assuming you have the firebase file in the same directory
import { Loader } from './components/Loader';
import { Header } from './pages/header';
import { Roomz } from './pages/roomz';
import { Dash } from './pages/dash';
import { About } from './pages/about';
import { Authh } from './pages/Auth/Authh';
import { SignUp } from './pages/Auth/SignUp';
import { Navigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import LevelsPage from './Levels/Levels';
import LevelDetailPage from './Levels/levelDetails';
import {NextUIProvider} from "@nextui-org/react";
import { Todo } from './components/Todo';
function App() {

  let nombre ="";
  let email="";
  let photoURL=null;
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
     nombre = user.displayName;
     email = user.email;
     photoURL = user.photoURL;
     
  // glow effect for sign in button
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoading(false);
      setIsAuth(!!user);
      setUser(user);
      
    });

    return () => unsubscribe();
  }, []);

  const PrivateRoute = ({ element, ...props }) => {
    console.log('PrivateRoute - Checking authentication status');
    
    if (isAuth) {
      console.log('PrivateRoute - User is authenticated, rendering element');
      return element;
    } else {
      console.log('PrivateRoute - User is not authenticated, showing alert');
      alert('Please sign in first :)');
      console.log('PrivateRoute - Navigating to /auth');
      return <Navigate to="/auth" />;
    }
  };
  
 

  
  return (
    <NextUIProvider>

    
    <div className="app">
      
      <BrowserRouter>
        <Header name={nombre} email={email} photo={photoURL}/>
        
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Authh />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/chat" element={<PrivateRoute element={<Roomz />} />} />
          <Route path="/" element={<PrivateRoute element={<Dash name={nombre}/>} />} />
          <Route path="/learn" element={<LevelsPage name={nombre} currentUser={user}/>} />
        <Route path="/level/:levelId" element={<LevelDetailPage />} />
        </Routes>
      </BrowserRouter>
    </div>
    </NextUIProvider>
  );

  }
export default App;