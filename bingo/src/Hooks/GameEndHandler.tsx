import { useState } from "react";
import { GameData, GridSize } from "../DataTypes";

export const useGameEndHandler = (ResetGameTimer: (gameTimer:number)=>void,gameTime:number,SendRequest:(requestData:GameData)=>void,ResetPeerConnection:()=>void,DisconnectedFromPlayer:()=>void,ResetPlayerConnectionStatus:()=>void,GamePropsReset:()=>void,HandleGridSize:(gridSize:GridSize,lock:boolean)=>void)=>{
    const [won, setWon] = useState<boolean | null>(null);
    const [gameEnded, setGameEnded] = useState(false);
    const [resetGame, setResetGame] = useState(false);
    function GameFinished(result:boolean,networkCall : boolean){
        setGameEnded(true);
        if (result===false){
            setWon(false);
        }else{
          setWon(true);
        }
        if (!networkCall){
          SendGameResult(result)
        }
      }
      function SendGameResult(result:boolean){
        SendRequest({ id: "gr", content: !result } as GameData);
      }
      function resetAndSendSignal(){
        SendRequest({"id":"rg","content":gameTime} as GameData);
        ResetGameProps()
        ResetGameTimer(gameTime);
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