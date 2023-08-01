import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  // Edit 버튼
  const [editing, setEditing] = useState(false); // editing mode 인가?
  const [newNweet, setNewNweet] = useState(nweetObj.text); // input에 입력된 text update
  
  // delete 버튼
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete(); 
      if (nweetObj.attachmentUrl) {
        await storageService.refFromURL(nweetObj.attachmentUrl).delete(); // 사진 삭제
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false); // editing mode 해제
  };
  // edit 내용 변경 중일때 내용 표시
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
    };

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text" 
                  placeholder="Edit your nweet"
                  value={newNweet} 
                  required 
                  onChange={onChange}
                />
                <input type="submit" value="Update Nweet" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="50px" height="50px" />}
          {isOwner && ( // owner일 때만 button 보임 
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;