const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 5,         // Max 5 requests
  duration: 60,      // Per 60 seconds (1 minute)
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({ message: 'Too many requests. Please try again later.' });
    });
};

module.exports = rateLimiterMiddleware;
