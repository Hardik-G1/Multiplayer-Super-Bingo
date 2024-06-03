import React from 'react';

export interface GameInfoProps {
  isOrganiser: number;
  isConnected: boolean;
  userKey: string;
  secondKey: string;
  setSecondKey: (key: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({ isOrganiser, isConnected, userKey, secondKey, setSecondKey, handleSubmit }) => {
  return (
    <div>
      {isOrganiser === 2 && !isConnected && <p>Hi, your key is: {userKey}</p>}
      {isOrganiser === 1 && !isConnected && <form onSubmit={handleSubmit}>
        <label>
          Enter other player key:
          <input
            type="text"
            value={secondKey}
            onChange={(e) => setSecondKey(e.target.value)}
          />
        </label>
        <input type="submit" />
      </form>}
    </div>
  );
};
