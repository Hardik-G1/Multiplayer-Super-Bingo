import React from 'react';
export interface TurnIndicatorProps {
    allReady: boolean;
    gameEnded: boolean;
    yourTurn:boolean|null;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ allReady, gameEnded,yourTurn }) => {
  return (
    <>
    {allReady && !gameEnded && (yourTurn===true ? <p>It's your turn</p> : <p>It's opponent's turn</p>)}
    </>
  );
};
