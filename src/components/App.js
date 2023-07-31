import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // Log In 될 때
  // onAuthStateChange : 로그인, 로그아웃, app 초기화 시 발생
  useEffect(() => {
    // 로그인한 user를 받고
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true); // Log in 시 = user 받았을 떼
        setUserObj(user); // 어딘가에 user 저장하여 사용
      } else {
        setIsLoggedIn(false);
      }
      setInit(true); // app 실행 시에는 항상 true
    });
  }, []);
 

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Intializing..."}
     
    </>
  );
}

export default App;
