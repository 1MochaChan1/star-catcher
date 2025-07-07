import { useEffect, useState } from "react";
import type { Player } from "../global/game-manager";
import GameManager from "../global/game-manager";

export function LeaderboadComponent() {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    const gm = GameManager.getInstance();

    gm.onNotify(getScores);

    getScores();
  }, []);

  async function getScores() {
    const data = await GameManager.getInstance().getLeaderboard();

    setLeaderboard(data);
  }

  return (
    <div className="w-[300px] h-[600px] bg-gray-900 text-white rounded-md p-6 shadow-lg flex flex-col">
      <h2 className="text-xl font-semibold  text-yellow-200 mb-4">
        🏆 Leaderboard
      </h2>
      <ul className="space-y-2 text-sm text-gray-200">
        {leaderboard.map((player) => (
          <li key={player.name}>{`${player.name} — ${player.highestScore}`}</li>
        ))}
      </ul>
    </div>
  );
}
