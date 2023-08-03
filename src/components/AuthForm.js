import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  // 키보드 입력마다 onChange
  const onChange = (event) => {
    const {
      target: { name, value }, // input 태그의 onClick={onSocialClick} name, value => name으로 email, password 구분하고 value로 키보드 입력값 받음
    } = event;
    if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value)
    }
  };

  const onSubmit = async(event) => {
    event.preventDefault(); // submit의 기본동작(새로고침) 막음
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(email, password);
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  
  return (
    <>
      <form onSubmit={onSubmit}>
      <input 
        name="email" 
        type="email" 
        placeholder="Email" 
        required 
        value={email} 
        onChange={onChange}
        />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={onChange}
        />
      <input 
        type="submit" 
        value={newAccount ? "Create Account" : "Sign In"}
      />
      {error}
    </form>
    <span onClick={toggleAccount}>
      {newAccount ? "Sign in" : "Create Account"}
    </span>
  </>
  )
}

export default AuthForm;