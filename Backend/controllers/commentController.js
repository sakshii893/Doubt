const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Doubt = require('../models/Doubt');

// @desc    Add a comment to a doubt (Mentor only)
exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { text } = req.body;
    const { doubtId } = req.params;

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const comment = await Comment.create({
      doubt: doubtId,
      user: req.user.id,
      text,
    });

    // ✅ Mark as resolved if mentor replies
    if (req.user.role === 'mentor') {
      doubt.status = 'resolved';
      await doubt.save();
    }

    // ✅ Populate user info in the response
    const populatedComment = await comment.populate('user', 'name role');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// @desc    Get all comments for a doubt
exports.getCommentsByDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;

    const comments = await Comment.find({ doubt: doubtId })
      .populate('user', 'name role')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



