import { dbService, storageService } from "fbase";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState(""); 
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");
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

  const onSubmit = async(event) => {
    event.preventDefault();
    let attachmentUrl = ""; // 사진 없는 글만 nweet
    // 사진 첨부시
    if (attachment !== "") {
      // storage의 이미지 폴더 생성
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      // 폴더에 이미지 넣는 작업
      const response = await attachmentRef.putString(attachment, "data_url");
      // 이미지의 reference에 접근 가능, 이미지가 저장된 storage 주소 받을 수 있음
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet(""); // submit 후 빈 문자열 반환
    setAttachment("");
  };

  const onChange = (event) => {
    const { 
      target: {value}
    } = event;
    setNweet(value); 
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event; // event 안에서 target 안으로 가서 파일을 받아옴
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result); 
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input 
        value={nweet}
        onChange={onChange}
        type="text" 
        placeholder="What's on your mind?" 
        maxLength={120} 
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
        )}
      </form>
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