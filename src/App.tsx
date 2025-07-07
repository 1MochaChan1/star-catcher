import { useEffect, useRef, useState } from "react";
import { startPhaser } from "./Game";
import GameManager from "./global/game-manager";
import GravitySelector from "./components/GravitySelector";
import { LeaderboadComponent } from "./components/Leaderboard";

function App() {
  const phaserRef = useRef<HTMLDivElement>(null);

  const gm = GameManager.getInstance();
  const [currScene, setCurrScene] = useState(gm.currScene);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrScene(gm.getCurrenScene());
    });

    if (phaserRef.current) {
      const game = startPhaser("gameCanvas");

      return () => {
        clearInterval(interval);
        game.destroy(true);
      };
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-12 my-16">
      {/* Game Canvas Wrapper */}
      <div className="border border-gray-700 drop-shadow-2xl rounded-md overflow-hidden">
        {currScene}
        {currScene === "scene-main-menu" ? (
          <div className="absolute mx-12 translate-y-[10vh]">
            <GravitySelector />
          </div>
        ) : null}
        <div
          id="gameCanvas"
          ref={phaserRef}
          className="w-[800px] h-[600px] bg-black"
        />
      </div>

      {/* Leaderboard Panel */}
      <LeaderboadComponent />
    </div>
  );
}

export default App;
