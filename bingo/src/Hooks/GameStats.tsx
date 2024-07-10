import { useState,  } from 'react';
import {  GameData, GridData, GridSize } from '../DataTypes';
import { getRandomFillData, saveGridDataInLocal } from '../Helper';

export const useGameStats = (pauseTimer:()=>void,gridSize: GridSize ,SendRequest:(requestData:GameData)=>void,yourTurn:boolean|null,setYourTurn:React.Dispatch<React.SetStateAction<boolean | null>>) => {
  const [gridData, setGridData] = useState<GridData[][]>(Array(gridSize).fill(null).map(() => Array(gridSize).fill({ number: '', struck: false } as GridData)));
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isGridFull, setIsGridFull] = useState(false);


  function strikeNumber(data: string) {
    SendRequest({ id: "ni", content: data } as GameData);
    SendRequest({ id: "tn", content: false } as GameData);
    setYourTurn(!yourTurn);
    if(yourTurn){
      pauseTimer();
    }
  }


function undo(){
    const newGridInfo = gridData.map((row) =>
      row.map((cell) =>
        cell.number === (currentNumber-1).toString() ? { number:"",struck:false} : cell
      )
    );
    setGridData(newGridInfo);
    setCurrentNumber((prev)=>{
      return prev-1;
    });
  }
  function updateGridForPlayerTwo(number: string) {
    setGridData((prevGridData) => {
      const newGridInfo = prevGridData.map((row) =>
        row.map((cell) =>
          cell.number === number ? { ...cell, struck: true } : cell
        )
      );
      return newGridInfo;
    });
  }

  function randomFill(){
    setGridData(getRandomFillData(gridSize));
  }
  function saveGrid(name:string){
    saveGridDataInLocal(gridData,name,gridSize);
  }

  function clearGrid(){
    setGridData(Array(gridSize).fill(null).map(() => Array(gridSize).fill({ number: '', struck: false } as GridData)));
    setCurrentNumber(1);
  }
  function GamePropsReset(){
    setGridData(Array(gridSize).fill(null).map(() => Array(gridSize).fill({ number: '', struck: false } as GridData)));
    setIsGridFull(false);
    setCurrentNumber(1);
  }
  return {
    gridData,
    setGridData,
    currentNumber,
    setCurrentNumber,
    undo,
    randomFill,
    saveGrid,
    clearGrid,
    isGridFull,
    setIsGridFull,
    strikeNumber,
    updateGridForPlayerTwo,
    GamePropsReset
  };
};
