import {  Dispatch, SetStateAction, useEffect, useState } from "react";
import { GridData, GridSize, wordsMapping } from "../DataTypes";
import "./Grid.css";
import { getStraightLines } from "../Helper";
import { WordWithStrikes } from "./WordWithStrikes";
interface GridProps {
    gridSize:GridSize
    isConnected: boolean;
    yourTurn:boolean|null;
    gridData:GridData[][];
    setGridData:Dispatch<SetStateAction<GridData[][]>>;
    setIsGridFull:Dispatch<SetStateAction<boolean>>;
    isGridFull:boolean;
    strikeNumber:(data:string)=>void;
    GameFinished:(won:boolean)=>void;
    resetGame:boolean;
    currentNumber:number;
    setCurrentNumber:Dispatch<SetStateAction<number>>;
    allReady:boolean;
    gameEnded:boolean;
  }
function Grid({gridData,setGridData,isConnected,GameFinished,allReady,gameEnded,gridSize,currentNumber,setCurrentNumber,yourTurn,setIsGridFull,isGridFull,strikeNumber,resetGame}:GridProps){
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
            GameFinished(true)
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
        return !gridData[rowIndex][colIndex].struck;
    }
    function checkForLines(){
        setLinesCount(getStraightLines(gridData));
    }
    function checkReadyorEnded(){
      return (!isConnected && !allReady && gameEnded);
    }
  
    function handleCellClick(rowIndex:number,colIndex:number){
        //provide a message to the user on disabled actions
        if(checkReadyorEnded()){
            return;
        }
        else if(gridData[rowIndex][colIndex].number === ''){
            ManualCellFill(rowIndex,colIndex);
            checkIfGridIsFull();
        }else if(isGridFull && yourTurn && checkIsNotAlreadyStriked(rowIndex,colIndex)){
            StrikeCell(rowIndex,colIndex);
        }
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
    return(<>
     {isConnected && (
        <div className="grid-container">
          {gridData.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`grid-cell ${cell.struck ? 'struck' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.number}
                </div>
              ))}
            </div>
          ))}
          <WordWithStrikes word={word} linesCount={linesCount} />
        </div> 
      )}
    </>)
}
export default Grid;