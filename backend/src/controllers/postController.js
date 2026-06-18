const Post = require('../models/Post');
const geminiService = require('../services/geminiService');
const redisService = require('../services/redisService');

// Helper to extract hashtags from text
const extractHashtags = (text) => {
  if (!text) return [];
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  return matches ? matches.map((tag) => tag.replace('#', '').toLowerCase()) : [];
};

// @desc    Generate a LinkedIn post
// @route   POST /api/posts/generate
// @access  Private
const generatePost = async (req, res, next) => {
  try {
    const { topic, tone, length } = req.body;
    const userId = req.user.id;

    if (!topic || !tone || !length) {
      return res.status(400).json({ message: 'Topic, tone, and length are required fields.' });
    }

    // Try to get from Cache first
    const cacheKey = `post:${userId}:${Buffer.from(topic).toString('base64').substring(0, 40)}:${tone}:${length}`;
    const cachedResponse = await redisService.getCache(cacheKey);

    if (cachedResponse) {
      console.log('Redis Cache Hit!');
      return res.status(200).json(cachedResponse);
    }

    console.log('Redis Cache Miss. Invoking Gemini API...');
    const content = await geminiService.generatePostContent(topic, tone, length);
    const hashtags = extractHashtags(content);

    // Automatically save to database
    const post = await Post.create({
      userId,
      topic,
      tone,
      length,
      generatedContent: content,
      hashtags,
      promptUsed: `Generate: topic=${topic}, tone=${tone}, length=${length}`,
    });

    // Save to Cache (TTL 1 hour)
    await redisService.setCache(cacheKey, post, 3600);

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const rewritePost = async (req, res, next) => {
  try {
    const { originalPost } = req.body;
    const userId = req.user.id;

    if (!originalPost) {
      return res.status(400).json({ message: 'Original post content is required.' });
    }

    const rewrittenContent = await geminiService.rewritePostContent(originalPost);
    const hashtags = extractHashtags(rewrittenContent);

    // Save to DB
    const post = await Post.create({
      userId,
      topic: originalPost.substring(0, 80) + '...',
      tone: 'custom-rewrite',
      length: 'na',
      generatedContent: rewrittenContent,
      hashtags,
      promptUsed: 'Rewrite draft',
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate carousel slide content
// @route   POST /api/posts/carousel
// @access  Private
const generateCarousel = async (req, res, next) => {
  try {
    const { topic } = req.body;
    const userId = req.user.id;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required.' });
    }

    const carouselContent = await geminiService.generateCarouselContent(topic);

    // Save to DB
    const post = await Post.create({
      userId,
      topic,
      tone: 'carousel',
      length: 'na',
      generatedContent: carouselContent,
      hashtags: [],
      promptUsed: 'Generate PDF Carousel',
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle post favorite status
// @route   PATCH /api/posts/:id/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    post.isFavorite = !post.isFavorite;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user post history
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search, favorite } = req.query;

    const query = { userId };

    if (search) {
      // Search topic, generatedContent, or hashtags
      query.$or = [
        { topic: { $regex: search, $options: 'i' } },
        { generatedContent: { $regex: search, $options: 'i' } },
        { hashtags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (favorite === 'true') {
      query.isFavorite = true;
    }

    // Return latest posts first
    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post from history
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Post deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics / stats
// @route   GET /api/posts/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Total post count
    const totalPosts = await Post.countDocuments({ userId });

    // Favorite posts count
    const favoritePosts = await Post.countDocuments({ userId, isFavorite: true });

    // Posts created in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const postsThisWeek = await Post.countDocuments({
      userId,
      createdAt: { $gte: oneWeekAgo },
    });

    // Most used tone
    const toneAggregation = await Post.aggregate([
      { $match: { userId } },
      { $group: { _id: '$tone', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const mostUsedTone = toneAggregation.length > 0 ? toneAggregation[0]._id : 'None yet';

    res.status(200).json({
      totalPosts,
      favoritePosts,
      postsThisWeek,
      mostUsedTone,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generatePost,
  rewritePost,
  generateCarousel,
  toggleFavorite,
  getPosts,
  deletePost,
  getStats,
};
