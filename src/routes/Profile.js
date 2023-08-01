import { authService, dbService } from "fbase";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default ({ userObj }) => { // 로그인한 유저 정보 prop으로 받기
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  // 내 nweets 얻는 function
  const getMyNweets = async () => {
    // db data 필터링
    // dbService의 컬렉션 중 "nweets" Docs에서 
    //uerObj의 uid와 동일한 creatorId를 가진 모든 문서를 
    //시간순으로 가져오는 쿼리(요청) 생성
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("creatorAt")
      .get();
    console.log(nweets.docs.map((doc) => doc.data()));
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
    }
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
    <form onSubmit={onSubmit}>
      <input
        onChange={onChange} 
        type="text" 
        placeholder="Display name"
        value={newDisplayName} 
      />
      <input type="submit" value="Update Profile" />
    </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
