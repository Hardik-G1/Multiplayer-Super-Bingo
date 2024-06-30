import { useState } from "react";
import { GameData, GridSize } from "../DataTypes";

export const useGameEndHandler = (SendRequest:(requestData:GameData)=>void,ResetPeerConnection:()=>void,DisconnectedFromPlayer:()=>void,ResetPlayerConnectionStatus:()=>void,GamePropsReset:()=>void,sendResetSignal:()=>void,HandleGridSize:(gridSize:GridSize,lock:boolean)=>void)=>{
    const [won, setWon] = useState<boolean | null>(null);
    const [gameEnded, setGameEnded] = useState(false);
    const [resetGame, setResetGame] = useState(false);
    function GameFinished(won:boolean){
        setGameEnded(true);
        if (won===false){
            setWon(false);
            return;
        }
        setWon(true);
        SendRequest({ id: "gr", content: false } as GameData);
      }
      function resetAndSendSignal(){
        sendResetSignal();
        ResetGameProps()
      }
      function ResetGameEndProps(){
        setResetGame((prev: any)=>!prev);
        setGameEnded(false);
        setWon(null);
      }
      function leaveGame() {
        HandleGridSize(5 as GridSize,false);
        DisconnectedFromPlayer();
        ResetPeerConnection();
      }
      function ResetGameProps(){
        ResetGameEndProps()
        ResetPlayerConnectionStatus()
        GamePropsReset()
      }
      return {
        won,
        GameFinished,
        ResetGameProps,
        resetAndSendSignal,
        gameEnded,
        resetGame,
        leaveGame
      };
}