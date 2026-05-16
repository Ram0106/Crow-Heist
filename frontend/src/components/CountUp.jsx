import { useEffect, useState } from 'react';

export default function CountUp({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Number(value || 0);
    const start = performance.now();
    let frame = 0;

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Math.floor(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, value]);

  return <span>{display}</span>;
}
