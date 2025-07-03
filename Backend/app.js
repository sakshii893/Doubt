const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors({
  origin: "https://doubt-two.vercel.app", // your frontend port (Vite default)
  credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/uploads', express.static('uploads'));


app.get("/",function(req,res){
    res.send("chal rha haii ")

})
app.use('/api/auth', authRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/comments', commentRoutes);

module.exports = app;
