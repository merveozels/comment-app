import { useRef, useState } from 'react';
import data from './data';
import { marked } from 'marked';

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
      name: "User",
      likes: 0,
      dislikes: 0,
      photo: "/assets/img/bos-avatar.jpg",
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

    setData(updatedComments);
    dialogRef.current[id].close();
  }


  return (
    <div className="comment-container">
      <Textbox
        datas={datas} setData={setData} />
      <h1>Comments</h1>
      {datas.map(comment => (
        <div className="comment-card" key={comment.id}>
          <div className="card-top">
            <h2>{comment.name}</h2>
            <span>{comment.time}</span>
          </div>
          <div className="card-middle">
            <p dangerouslySetInnerHTML={{ __html: marked.parse(comment.comment) }} />
          </div>
          <div className="card-bottom">
            <button onClick={() => handleIncreaseLikes(comment.id)}>
              <img src="./public/assets/img/like.png" alt="like" /> {comment.likes}
            </button>
            <button onClick={() => handleDecreaseLikes(comment.id)}>
              <img src="./public/assets/img/dislike.png" alt="dislike" /> {comment.dislikes}
            </button>
            <button onClick={() => handleReply(comment.id)}>Reply</button>
          </div>
          <dialog ref={el => (dialogRef.current[comment.id] = el)}>
            <form ref={el => (dialogInputRef.current[comment.id] = el)} onSubmit={e => handleSend(e, comment.id)}>
              <textarea name="comment" placeholder="Add your comment"></textarea>
              <button type="submit">Submit</button>
            </form>
          </dialog>
          {comment.replies?.map(reply => (
            <div key={reply.id} className="replies-section">
              <div className="card-top">
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
      ))}
    </div>
  );
}


function Textbox({ datas, setData }) {
  const textInput = useRef();
  const textareaRef = useRef();

  // Zaman farkını hesaplayan fonksiyon
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

  function handleComment(e) {
    e.preventDefault();

    const formData = new FormData(textInput.current);
    const formObj = Object.fromEntries(formData);
    const styledText = textareaRef.current.value;

    const updatedFormObj = {
      ...formObj,
      comment: styledText,
      id: crypto.randomUUID(),
      name: "Merve Ozel",
      likes: "0",
      dislikes: "0",
      replies: [],
      photo: "/assets/img/bos-avatar.jpg",
      time: timeAgo(new Date()),
    };

    if (!formObj.comment || formObj.comment.trim() === "") {
      alert("You couldn't send empty");
      return;
    }

    setData([...datas, updatedFormObj]);
    textInput.current.reset();
  }

  return (
    <div className="text-box-container">
      <form ref={textInput} onSubmit={handleComment}>
        <textarea
          className='textarea'
          name="comment"
          placeholder="Add your comment"
          ref={textareaRef}
        ></textarea>
        <div className="btn-area">
          <div className="type-btns">
            <button type='button'>B</button>
            <button type='button'>I</button>
            <button type='button'>😊</button>
          </div>
          <button type="submit" className='submitBtn'>Submit</button>
        </div>
      </form>
    </div>
  );
}


export default App;
