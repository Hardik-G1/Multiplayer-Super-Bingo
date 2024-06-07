import React from 'react';

export interface ReadySignalProps {
  readySignal: () => void;
}

export const ReadySignal: React.FC<ReadySignalProps> = ({ readySignal}) => {
  return (
    <>
    <button onClick={readySignal}>Ready</button>
    
    </>
  );
};
