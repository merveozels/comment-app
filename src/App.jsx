import { useRef, useState } from 'react';
import data from './data';
import EmojiPicker, { Emoji } from 'emoji-picker-react';

function App() {
  const [datas, setData] = useState(data);
  const [reaction, setReaction] = useState({
    likes: [],
    dislikes: []
  });
  const [reactionComment, setReactionComment] = useState({
    likes: [],
    dislikes: []
  });
  return (
    <>
      <Comments
        datas={datas} setData={setData}
        reaction={reaction} setReaction={setReaction}
        reactionComment={reactionComment} setReactionComment={setReactionComment}
      />
    </>
  );
}

function Comments({ datas, setData, reaction, setReaction, reactionComment }) {
  const dialogRef = useRef({}); // bu dialogun userefi

  const dialogInputRef = useRef({});  // bu formun userefi

  const [isBold, setBold] = useState(false)
  const [isItalic, setItalic] = useState(false)
  const [isUnderline, setUnderline] = useState(false)

  const [totalComment, setTotalComment] = useState(6)

  const [isReplyBold, setReplyBold] = useState(false)
  const [isReplyItalic, setReplyItalic] = useState(false)
  const [isReplyUnderline, setReplyUnderline] = useState(false)

  const [isEmoji, setEmoji] = useState(false);
  const [text, setText] = useState("");


  function handleIncreaseLikes(id) {
    const thisComment = datas.find(comment => comment.id === id);
    if (!thisComment) return;

    if (reaction.dislikes.includes(id)) {
      thisComment.dislikes--;
      reaction.dislikes = reaction.dislikes.filter(x => x !== id);
    }

    if (reaction.likes.includes(id)) {
      thisComment.likes--;
      reaction.likes = reaction.likes.filter(x => x !== id);
    } else {
      thisComment.likes++;
      reaction.likes.push(id);
    }

    setReaction({ ...reaction });
    setData([...datas]);
  }

  function handleDecreaseLikes(id) {
    const thisComment = datas.find(comment => comment.id === id);
    if (!thisComment) return;

    if (reaction.likes.includes(id)) {
      thisComment.likes--;
      reaction.likes = reaction.likes.filter(x => x !== id);
    }

    if (reaction.dislikes.includes(id)) {
      thisComment.dislikes--;
      reaction.dislikes = reaction.dislikes.filter(x => x !== id);
    } else {
      thisComment.dislikes++;
      reaction.dislikes.push(id);
    }

    setReaction({ ...reaction });
    setData([...datas]);
  }

  function handleReplyLikes(id) {
    // Parent yorumu buldum
    const thisComment = datas.find(comment =>
      comment.replies && comment.replies.some(reply => reply.id === id)
    );

    if (thisComment) {
      // Parent yorumun içinde ilgili reply'yi buldum unutma yöntem güzel
      const replyIndex = thisComment.replies.findIndex(reply => reply.id === id);
      const thisReply = thisComment.replies[replyIndex];

      if (reactionComment.dislikes.includes(id)) {
        thisReply.dislikes--;
        reactionComment.dislikes = reactionComment.dislikes.filter(x => x !== id);
      }

      if (reactionComment.likes.includes(id)) {
        thisReply.likes--;
        reactionComment.likes = reactionComment.likes.filter(x => x !== id);
      } else {
        thisReply.likes++;
        reactionComment.likes = [...reactionComment.likes, id];
      }
      setReaction({ ...reactionComment });
      setData([...datas]);
    }
  }

  function handleReplyDislikes(id) {
    const thisComment = datas.find(comment =>
      comment.replies && comment.replies.some(reply => reply.id === id)
    );
    if (thisComment) {
      const replyIndex = thisComment.replies.findIndex(reply => reply.id === id);
      const thisReply = thisComment.replies[replyIndex];

      if (reactionComment.dislikes.includes(id)) {
        thisReply.dislikes--;
        reactionComment.dislikes = reactionComment.dislikes.filter(x => x !== id);
      } else {
        if (reactionComment.likes.includes(id)) {
          thisReply.likes--;
          reactionComment.likes = reactionComment.likes.filter(x => x !== id);
        }
        thisReply.dislikes++;
        reactionComment.dislikes = [...reactionComment.dislikes, id];
      }
      setReaction({ ...reactionComment });
      setData([...datas]);
    }
  }

  function handleReply(id) {
    const currentDialog = dialogRef.current[id];
    if (currentDialog) currentDialog.showModal();
  }

  function handleSend(e, id) {
    e.preventDefault();
    const replyInput = dialogInputRef.current[id];

    const formData = new FormData(replyInput);
    const formObj = Object.fromEntries(formData);

    const newReply = {
      ...formObj,
      id: crypto.randomUUID(),
      name: "Merve Özel",
      likes: 0,
      dislikes: 0,
      photo: "./assets/img/merve-avatar.jpg",
      time: "Just now",
    };

    const updatedComments = datas.map(x => {
      if (x.id === id) {
        return {
          ...x,
          replies: [...x.replies, newReply],
        };
      }
      return x;
    });

    if (!formObj.comment || formObj.comment.trim() === "") {
      alert("You couldn't send empty");
      return;
    }
    setTotalComment(totalComment + 1)
    setData(updatedComments);
    dialogRef.current[id].close();
  }

  function handleEmoji() {
    setEmoji((prev) => !prev);
  }

  function handleEmojiClick(emojiData) {
    setText(prevText => prevText + emojiData.emoji);
    setEmoji(false);
  }


  function handleBold() {
    setReplyBold((prev) => !prev);
  }

  function handleItalic() {
    setReplyItalic((prev) => !prev);
  }

  function handleUnderline() {
    setReplyUnderline((prev) => !prev);
  }

  return (
    <div className="comment-container">
      <Textbox
        datas={datas} setData={setData}
        isBold={isBold} setBold={setBold}
        isItalic={isItalic} setItalic={setItalic}
        isUnderline={isUnderline} setUnderline={setUnderline}
        totalComment={totalComment} setTotalComment={setTotalComment}
      />
      <div className="header">
        <h1>Comments</h1>
        <span className='totalComment'>{totalComment}</span>
      </div>
      {datas.map(comment => (
        <div className="card-container">
          <div className="comment-card" key={comment.id}>
            <div className="card-top">
              <div className="card-top-img"><img src={comment.photo} alt="" /></div>
              <div className="card-top-text">
                <h2>{comment.name}</h2>
                <span className='commentTime'>{comment.time}</span>
              </div>
            </div>
            <div className="card-middle">
              <p style={{
                fontWeight: comment.isBold ? "bold" : "normal",
                fontStyle: comment.isItalic ? "italic" : "normal",
                textDecoration: comment.isUnderline ? "underline" : "normal",
              }}>{comment.comment}</p>
            </div>
            <div className="card-bottom">
              <button onClick={() => handleIncreaseLikes(comment.id)}>
                <img src="./public/assets/img/like.png" alt="like" /> {comment.likes}
              </button>
              <button onClick={() => handleDecreaseLikes(comment.id)}>
                <img src="./public/assets/img/dislike.png" alt="dislike" /> {comment.dislikes}
              </button>
              <button onClick={() => handleReply(comment.id)}>   <img className='replyIcon' src="./public/assets/img/reply-icon.svg" alt="" /> Reply </button>
            </div>
            <dialog className='dialogReply' ref={el => (dialogRef.current[comment.id] = el)} style={{ height: isEmoji ? "550px" : "170px" }}>
              <form ref={el => (dialogInputRef.current[comment.id] = el)} onSubmit={e => handleSend(e, comment.id)}>
                <textarea
                  value={text}
                  className="textarea"
                  name="comment"
                  placeholder="Add comment..."
                  ref={dialogInputRef}
                  style={{
                    fontWeight: isReplyBold ? "bold" : "normal",
                    fontStyle: isReplyItalic ? "italic" : "normal",
                    textDecoration: isReplyUnderline ? "underline" : "normal"
                  }}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
                {isEmoji && (
                  <>
                    <div className="genelReply">
                      <div className="emojiPicker">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    </div>
                  </>
                )}
                <div className="btn-area">
                  <div className="type-btns">
                    <div className="boldBtns">
                      <button className='boldBtn' type="button" onClick={handleBold} style={{ color: isReplyBold ? "#ea4d32" : "black" }}>B</button>
                      <button className="italicBtn" type="button" onClick={handleItalic} style={{ color: isReplyItalic ? "#ea4d32" : "black" }}>I</button>
                      <button className='underlineBtn' type="button" onClick={handleUnderline} style={{ color: isReplyUnderline ? "#ea4d32" : "black" }} >U</button>
                    </div>
                    <button className='emojibtn' type="button" onClick={handleEmoji}>😊</button>
                  </div>
                  <button type="submit" className="submitBtn">Submit</button>
                </div>
              </form>
            </dialog>
            {comment.replies?.map(reply => (
              <div key={reply.id} className="replies-section">
                <div className="card-top">
                  <img src={reply.photo} alt="" />
                  <h2>{reply.name}</h2>
                  <span>{reply.time}</span>
                </div>
                <div className="card-middle">
                  <p>{reply.comment}</p>
                </div>
                <div className="card-bottom">
                  <button onClick={() => handleReplyLikes(reply.id)}>
                    <img src="./public/assets/img/like.png" alt="like" /> {reply.likes}
                  </button>
                  <button onClick={() => handleReplyDislikes(reply.id)}>
                    <img src="./public/assets/img/dislike.png" alt="dislike" /> {reply.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


function Textbox({ datas, setData, isBold, setBold, isItalic, setItalic, isUnderline, setUnderline, setTotalComment, totalComment }) {
  const textInput = useRef();
  const textareaRef = useRef();

  const [isEmoji, setEmoji] = useState(false);
  const [text, setText] = useState("");

  function timeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      return "Less than an hour ago";
    } else if (hours === 1) {
      return "1 hour ago";
    } else {
      return `${hours} hours ago`;
    }
  }

  function handleBold() {
    setBold((prev) => !prev);
  }

  function handleItalic() {
    setItalic((prev) => !prev);
  }

  function handleUnderline() {
    setUnderline((prev) => !prev);
  }

  function handleComment(e) {
    e.preventDefault();

    const formData = new FormData(textInput.current);
    const formObj = Object.fromEntries(formData);
    const styledText = text;

    const updatedFormObj = {
      ...formObj,
      comment: styledText,
      id: crypto.randomUUID(),
      name: "Merve Ozel",
      likes: "0",
      dislikes: "0",
      replies: [],
      photo: "./assets/img/merve-avatar.jpg",
      time: timeAgo(new Date()),
      isBold: isBold ? isBold : null,
      isItalic: isItalic ? isItalic : null,
      isUnderline: isUnderline ? isUnderline : null,
    };

    if (!formObj.comment || formObj.comment.trim() === "") {
      alert("You couldn't send empty");
      return;
    }

    setData([...datas, updatedFormObj]);
    textInput.current.reset();
    setText("");
    setBold(false);
    setItalic(false);
    setUnderline(false);
    setEmoji(false)
    setTotalComment(totalComment + 1)
  }

  function handleEmoji() {
    setEmoji((prev) => !prev);
  }

  function handleEmojiClick(emojiData) {
    setText(prevText => prevText + emojiData.emoji);
  }

  return (
    <div className="text-box-container">
      <form ref={textInput} onSubmit={handleComment}>
        <textarea
          value={text}
          className="textarea"
          name="comment"
          placeholder="Add comment..."
          ref={textareaRef}
          style={{
            fontWeight: isBold ? "bold" : "normal",
            fontStyle: isItalic ? "italic" : "normal",
            textDecoration: isUnderline ? "underline" : "normal"
          }}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {isEmoji && (
          <>
            <div className="genel">
              <div className="overlay"></div>
              <div className="emoji-picker">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            </div>
          </>
        )}
        <div className="btn-area">
          <div className="type-btns">
            <div className="boldBtns">
              <button className='boldBtn' type="button" onClick={handleBold} style={{ color: isBold ? "#ea4d32" : "black" }}>B</button>
              <button className="italicBtn" type="button" onClick={handleItalic} style={{ color: isItalic ? "#ea4d32" : "black" }}>I</button>
              <button className='underlineBtn' type="button" onClick={handleUnderline} style={{ color: isUnderline ? "#ea4d32" : "black" }} >U</button>
            </div>
            <button className='emojibtn' type="button" onClick={handleEmoji}>😊</button>

          </div>
          <button type="submit" className="submitBtn">Submit</button>
        </div>
      </form>
    </div>
  );
}


export default App;