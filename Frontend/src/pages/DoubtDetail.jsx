import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../auth/AuthContext';
import { toast } from 'react-toastify';

function DoubtDetail() {
  const { id } = useParams(); // doubt ID
  const { user } = useContext(AuthContext);
  const [doubt, setDoubt] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const commentsEndRef = useRef(null);

  // Scroll to bottom of comments
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchDoubt = async () => {
    try {
      const res = await axios.get(`/doubts/${id}`);
      setDoubt(res.data);
    } catch (err) {
      toast.error("Failed to fetch doubt details");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      toast.error("Failed to fetch comments");
    }
  };

  useEffect(() => {
    fetchDoubt();
    fetchComments();
  }, []);

  // Scroll down on comment update
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`/comments/${id}`, { text: newComment });
      toast.success("Comment added");
      setNewComment("");
      fetchComments();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  if (!doubt) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{doubt.title}</h2>
      <p>{doubt.description}</p>
      <p><strong>Status:</strong> {doubt.status}</p>

      {doubt.file && (
        <div style={{ margin: "10px 0" }}>
          <a
            href={doubt.file}
            target="_blank"
            rel="noreferrer"
          >
            📎 View Attached File
          </a>
        </div>
      )}

      <hr />
      <h3>💬 Comments</h3>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "10px" }}>
          {comments.map((c) => (
            <div
              key={c._id}
              style={{
                padding: "8px",
                marginBottom: "6px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <strong>{c.user.name} ({c.user.role})</strong><br />
              <small>{new Date(c.createdAt).toLocaleString()}</small>
              <p>{c.text}</p>
            </div>
          ))}
          <div ref={commentsEndRef}></div>
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ width: "100%", height: "80px", padding: "8px" }}
        />
        <button
          onClick={handleCommentSubmit}
          style={{
            marginTop: "6px",
            padding: "8px 12px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}

export default DoubtDetail;
