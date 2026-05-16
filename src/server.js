const express = require('express');
const dotenv = require('dotenv');
const { connectDatabase } = require('./config/database');
const { seedLevelsIfEmpty } = require('./seed/seedLevels');
const { seedAchievements } = require('./services/achievementService');
const playerRoutes = require('./routes/playerRoutes');
const heistRoutes = require('./routes/heistRoutes');
const levelRoutes = require('./routes/levelRoutes');
const dailyHeistRoutes = require('./routes/dailyHeistRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'crow-heist-api',
      status: 'ok'
    },
    error: null
  });
});

app.use('/api/player', playerRoutes);
app.use('/api/heist', heistRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/daily-heist', dailyHeistRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/achievements', achievementRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  await connectDatabase();
  await seedLevelsIfEmpty();
  await seedAchievements();

  app.listen(port, () => {
    console.log(`Crow Heist API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
