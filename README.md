# Crow Heist API

REST API backend for the Crow Heist mobile game using Node.js, Express, MongoDB, and Mongoose.

## Setup

```bash
npm install
copy .env.example .env
npm run seed
npm start
```

## Response Shape

All endpoints return:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Errors return `success: false`, an empty `data` object, and a clean `error` message.

## Endpoints

- `POST /api/player/register`
- `GET /api/player/:id`
- `POST /api/heist/start`
- `POST /api/heist/submit`
- `GET /api/levels?player_id=<id>`
- `GET /api/daily-heist`
- `POST /api/daily-heist/submit`
- `GET /api/leaderboard/daily`
- `GET /api/leaderboard/global`
