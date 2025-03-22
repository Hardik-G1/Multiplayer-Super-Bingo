import React from 'react';
export interface TurnIndicatorProps {
    allReady: boolean;
    gameEnded: boolean;
    yourTurn:boolean|null;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ allReady, gameEnded,yourTurn }) => {
  return (
    <>
    {allReady && !gameEnded && (yourTurn===true ? <center>It's your turn</center> : <center>It's opponent's turn</center>)}
    </>
  );
};
