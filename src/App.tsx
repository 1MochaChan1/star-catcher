import { useEffect, useRef, useState } from "react";
import { startPhaser } from "./Game";
import GameManager from "./global/game-manager";

function App() {
  const phaserRef = useRef<HTMLDivElement>(null);

  const gm = GameManager.getInstance();
  const [leaderboard, setLeaderboard] = useState(gm.getLeaderboard());

  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard([...gm.getLeaderboard()]);
    });

    if (phaserRef.current) {
      const game = startPhaser("gameCanvas");

      return () => {
        game.destroy(true);
      };
      clearInterval(interval);
    }
  }, []);

  return (
    <div className="flex justify-center gap-12 my-16">
      {/* Game Canvas Wrapper */}
      <div className="border border-gray-700 drop-shadow-2xl rounded-md overflow-hidden">
        <div
          id="gameCanvas"
          ref={phaserRef}
          className="w-[800px] h-[600px] bg-black"
        />
      </div>

      {/* Leaderboard Panel */}
      <div className="w-[300px] h-[600px] bg-gray-900 text-white rounded-md p-6 shadow-lg flex flex-col">
        <h2 className="text-xl font-semibold  text-yellow-200 mb-4">
          🏆 Leaderboard
        </h2>
        <ul className="space-y-2 text-sm text-gray-200">
          {leaderboard.map((player) => (
            <li
              key={player.name}
            >{`${player.name} — ${player.highestScore}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
