import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import LevelSelect from './pages/LevelSelect.jsx';
import Heist from './pages/Heist.jsx';
import DailyHeist from './pages/DailyHeist.jsx';
import Result from './pages/Result.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Achievements from './pages/Achievements.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'home', element: <Home /> },
      { path: 'levels', element: <LevelSelect /> },
      { path: 'heist/:levelId', element: <Heist /> },
      { path: 'daily', element: <DailyHeist /> },
      { path: 'result', element: <Result /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'achievements', element: <Achievements /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
