import { dbService } from "fbase";
import React, { useState, useEffect } from "react";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => { 
  const [nweets, setNweets] = useState([]);
  // onSnapshot : db에 무슨일이 있을 때 알림
  // 여기서 collection은 "nweets"
  useEffect(() => {
    dbService.collection("nweets").onSnapshot((snapshot) => {
      // 새로운 스냅샷을 받을 때, 배열 생성
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data(),
      }));
      // 생성된 배열을 state에 집어 넣음
      setNweets(nweetArray);
    });
  }, []);
 
  return (
    <div>
      <NweetFactory userObj={userObj} />
      <div>
        {/* map을 이용하여 Nweet component 생성 */}
        {nweets.map((nweet) => (
          <Nweet 
            key={nweet.id} 
            nweetObj={nweet} 
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;