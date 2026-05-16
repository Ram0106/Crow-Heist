import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerPlayer } from '../api/player';
import { usePlayerStore } from '../store/playerStore';

export default function Landing() {
  const navigate = useNavigate();
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await registerPlayer(username);
      setPlayer(response.data.player);
      navigate('/home');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-crow-black">
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-[640px] px-4 text-center"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.55em] text-crow-gold">A quiet crime of feathers</p>
        <h1 className="text-5xl font-bold tracking-[0.08em] text-white sm:text-7xl lg:text-8xl">CROW HEIST</h1>
        <div className="mx-auto mt-12 grid w-full max-w-[420px] gap-3">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="username"
            className="border border-crow-line bg-black px-4 py-4 text-center text-lg text-white outline-none focus:border-crow-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="border border-crow-gold px-4 py-4 text-sm uppercase tracking-[0.3em] text-crow-gold hover:bg-crow-gold hover:text-black disabled:opacity-50"
          >
            {loading ? 'Registering' : 'Enter the Nest'}
          </button>
          {error ? <p className="text-sm text-crow-red">{error}</p> : null}
        </div>
      </motion.form>
    </main>
  );
}
