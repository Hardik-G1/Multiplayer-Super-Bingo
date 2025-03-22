"use client"

import { Dispatch, forwardRef, SetStateAction, useEffect, useState } from "react"
import { GridData, GridSize, wordsMapping } from "../DataTypes"
import CountdownTimer from "./Timer"
import { TurnIndicator } from "./TurnIndicator"
import { WinnerIndicator } from "./WinnerIndicator"
import { getStraightLines, showToast } from "../Helper"

interface GridProps {
  gridSize:GridSize
  isConnected: boolean;
  yourTurn:boolean|null;
  gridData:GridData[][];
  setGridData:Dispatch<SetStateAction<GridData[][]>>;
  setIsGridFull:Dispatch<SetStateAction<boolean>>;
  isGridFull:boolean;
  strikeNumber:(data:string)=>void;
  GameFinished:(result:boolean,networkCall:boolean)=>void;
  resetGame:boolean;
  currentNumber:number;
  setCurrentNumber:Dispatch<SetStateAction<number>>;
  gameEnded:boolean;
  SendWordStrikedFromOpponent:(data:string)=>void;
  initialTime: number;
  onComplete: () => void;
  allReady: boolean;
  won: boolean | null;
}
export interface CountdownTimerHandle {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (newTime: number) => void;
}
const BingoGrid = forwardRef<CountdownTimerHandle, GridProps>(({initialTime,onComplete,allReady,won,gridData,setGridData,isConnected,GameFinished,gameEnded,gridSize,currentNumber,setCurrentNumber,yourTurn,setIsGridFull,isGridFull,strikeNumber,resetGame,SendWordStrikedFromOpponent}:GridProps, ref) => {

    const [linesCount, setLinesCount] = useState(0);
    const word = wordsMapping[gridSize];

    useEffect(()=>{
        setGridData(Array(gridSize).fill(null).map(() => Array(gridSize).fill({ number: '', struck: false } as GridData)));
        setCurrentNumber(1);
    },[gridSize])

    useEffect(()=>{
        checkIfGridIsFull();
        checkForLines();
    },[gridData]);

    useEffect(() => {
        checkIfWon();
      }, [linesCount]);

    useEffect(()=>{
        setCurrentNumber(1);
        setLinesCount(0);
    },[resetGame])

    function checkIfWon(){
      if (linesCount >= word.length){
          GameFinished(true,false)
      }
    }  
    function checkIfGridIsFull(){
      const isFull =gridData.every(row => row.every(cell => cell.number !== ''));
      if (isFull){
          setCurrentNumber((gridSize*gridSize)+1);
      }
      setIsGridFull(isFull);
    };

    function checkIsNotAlreadyStriked(rowIndex: number, colIndex: number){
      if (gridData[rowIndex][colIndex].struck){
        showToast(gridData[rowIndex][colIndex].number +" already striked");
      }
      return !gridData[rowIndex][colIndex].struck;
    }

    function checkForLines(){
      let calculatedLinesCount=getStraightLines(gridData)
      if (calculatedLinesCount>linesCount){
        showToast(word[calculatedLinesCount-1]+" striked");
        SendWordStrikedFromOpponent(word[calculatedLinesCount-1]);
        setLinesCount(calculatedLinesCount);
      }
    }

    function checkReadyorEnded(){
      return (!isConnected || gameEnded);
    }

    function handleCellClick(rowIndex:number,colIndex:number){
      //provide a message to the user on disabled actions
      if(checkReadyorEnded()){
        showToast("Game not in session.");
        return;
      }
      else if(gridData[rowIndex][colIndex].number === ''){
          ManualCellFill(rowIndex,colIndex);
          checkIfGridIsFull();
      }else if(isGridFull && isYourTurn() && checkIsNotAlreadyStriked(rowIndex,colIndex)){
          StrikeCell(rowIndex,colIndex);
      }
    }
    function isYourTurn(){
      if (!yourTurn){
        showToast("It is not your turn");
      }
      return yourTurn;
    }
    function ManualCellFill(rowIndex:number,colIndex:number){
      const newGridData = gridData.map((row, rIdx) =>
          row.map((cell, cIdx) => ((rIdx === rowIndex && cIdx === colIndex) ? { number: currentNumber.toString(), struck: false } : cell))
      );
      setGridData(newGridData);
      setCurrentNumber(currentNumber + 1);
    }
    function StrikeCell(rowIndex:number,colIndex:number){
      const newStruckThrough = gridData.map((row, rIdx) =>
          row.map((cell, cIdx) => ((rIdx === rowIndex && cIdx === colIndex && !cell.struck) ? { ...cell, struck: true } : cell))
        );
      setGridData(newStruckThrough);
      strikeNumber(gridData[rowIndex][colIndex].number);
      checkForLines();
    }



  return (
    <>
    {isConnected && (<div className="game-column main-column">
      {initialTime>0 && <CountdownTimer ref={ref} initialTime={initialTime} onComplete={onComplete}/>}
      <div className={`bingo-grid grid-${gridSize}`}>
      {gridData.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`bingo-cell ${cell === null ? "empty" : ""} ${cell.struck  ? "selected" : ""}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell.number !== null && cell.number}
            </div>
          )))
        )}
      </div>
      <h2 className="bingo-title"> 
      {word.split('').map((char, index) => (
        <span key={index} className={index < linesCount ? 'struck' : ''}>
          {char}
        </span>
      ))}
      </h2>
      <TurnIndicator
        allReady={allReady}
        gameEnded={gameEnded}
        yourTurn={yourTurn}
      />
      <WinnerIndicator 
        won={won}
      />
    </div> )
  }
</>
  )
});

export default BingoGrid;