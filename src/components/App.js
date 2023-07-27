import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // Log In 될 때
  useEffect(() => {
    // 로그인한 user를 받고
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user); // 어딘가에 user 저장하여 사용
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
 

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Intializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
