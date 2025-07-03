const { validationResult } = require('express-validator');
const Doubt = require('../models/Doubt');
require('dotenv').config();
// const multer = require('../middleware/uploadMulter'); // ✅ Import multer middleware

const imagekit = require("../config/imageKit");

exports.createDoubt = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description } = req.body;
    let fileUrl = null;

    // ✅ Upload to ImageKit
    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer, // from memoryStorage
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/doubts", // optional
      });

      fileUrl = uploaded.url;
    }
    console.log(fileUrl);
    

    const doubt = await Doubt.create({
      title,
      description,
      user: req.user.id,
      file: fileUrl, // store ImageKit URL
    });

    res.status(201).json(doubt);
  } catch (error) {
    console.error("Create Doubt Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// @desc    Get doubts posted by logged-in student
exports.getMyDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all doubts (mentor view)
exports.getDoubts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const doubts = await Doubt.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a student's own doubt
exports.updateDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    if (doubt.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    doubt.title = req.body.title || doubt.title;
    doubt.description = req.body.description || doubt.description;
    doubt.file = req.body.file || doubt.file;

    await doubt.save();
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    if (doubt.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Doubt.findByIdAndDelete(req.params.id);
    res.json({ message: "Doubt deleted" });
  } catch (error) {
    console.error("Delete Doubt Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// @desc    Mark a doubt as resolved
exports.markResolved = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    if (doubt.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    doubt.status = 'resolved';
    await doubt.save();

    res.json({ message: 'Doubt marked as resolved' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Get doubt by ID
exports.getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id).populate("user", "name");
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    res.json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

