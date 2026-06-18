const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      maxlength: [300, 'Topic cannot exceed 300 characters'],
    },
    tone: {
      type: String,
      required: [true, 'Tone is required'],
      enum: ['professional', 'casual', 'storytelling', 'thought-leadership', 'custom-rewrite', 'carousel'],
    },
    length: {
      type: String,
      required: [true, 'Length is required'],
      enum: ['short', 'medium', 'long', 'na'],
    },
    generatedContent: {
      type: String,
      required: true,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    promptUsed: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
