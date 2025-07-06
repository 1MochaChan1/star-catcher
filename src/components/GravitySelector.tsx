import React, { useState } from 'react';
import GameManager from '../global/game-manager';

const GravitySelector = () => {
  const gm = GameManager.getInstance();
  const [selected, setSelected] = useState('low');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value as 'low' | 'medium' | 'high';
    setSelected(label);
    gm.setGravityFromLabel(label);
  };

  return (
    <div className="mb-4">
      <label htmlFor="gravity" className="text-white mr-2">Difficulty:</label>
      <select
        id="gravity"
        value={selected}
        onChange={handleChange}
        className="bg-gray-800 text-white border border-gray-600 px-3 py-1 rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
};

export default GravitySelector;
