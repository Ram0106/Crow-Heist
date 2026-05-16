function createRateLimiter({ windowMs, maxRequests }) {
  const buckets = new Map();

  return (req, res, next) => {
    const playerKey = req.body.player_id || req.ip;
    const now = Date.now();
    const bucket = buckets.get(playerKey) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(playerKey, bucket);

    if (bucket.count > maxRequests) {
      return res.status(429).json({
        success: false,
        data: {},
        error: 'Too many submit attempts. Please slow down.'
      });
    }

    next();
  };
}

const submitRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20
});

module.exports = {
  submitRateLimiter
};
