import React from 'react';
import './TurnIndicator.css';

export interface TurnIndicatorProps {
    allReady: boolean;
    gameEnded: boolean;
    yourTurn: boolean | null;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ allReady, gameEnded, yourTurn }) => {
  return (
    <div className="turn-indicator">
      {allReady && !gameEnded && (
        <div className={`turn-message ${yourTurn ? 'your-turn' : 'opponent-turn'}`}>
          {yourTurn ? (
            <>
              <span className="turn-emoji">🎯</span>
              <span className="turn-text">Your Turn!</span>
            </>
          ) : (
            <>
              <span className="turn-emoji">⏳</span>
              <span className="turn-text">Opponent's Turn</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
