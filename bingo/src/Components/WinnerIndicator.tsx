import React from 'react';
export interface WinnerIndicatorProps {
    won:boolean|null;
}

export const WinnerIndicator: React.FC<WinnerIndicatorProps> = ({ won }) => {
  return (
    <>
    {won!==null && (<>{ won ? (<h2>You won!</h2>):(<h2>You Lose</h2>)}</>)}
    </>
  );
};
