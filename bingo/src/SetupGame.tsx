import React from 'react';

export interface SetupGameProps {
  setupGame: () => void;
}

export const SetupGame: React.FC<SetupGameProps> = ({ setupGame }) => {
  return (
    <button onClick={setupGame}>Setup a Game</button>
  );
};
