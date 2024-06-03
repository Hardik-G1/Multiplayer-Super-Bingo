import React from 'react';

export interface WordWithStrikesProps {
  word: string;
  linesCount: number;
}

export const WordWithStrikes: React.FC<WordWithStrikesProps> = ({ word, linesCount }) => {
  return (
    <h2>
      {word.split('').map((char, index) => (
        <span key={index} className={index < linesCount ? 'struck' : ''}>
          {char}
        </span>
      ))}
    </h2>
  );
};
