import React from 'react';

export interface JoinGameProps {
  joinGame: () => void;
}

export const JoinGame: React.FC<JoinGameProps> = ({ joinGame }) => {
  return (
    <button onClick={joinGame}>Join a Game</button>
  );
};
