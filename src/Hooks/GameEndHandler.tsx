import { useState } from "react";
import { GameData } from "../DataTypes";
import { showToast } from "../Helper";

export const useGameEndHandler = (SendRequest:(requestData:GameData)=>void)=>{
    const [won, setWon] = useState<boolean | null>(null);
    const [gameEnded, setGameEnded] = useState(false);
    const [resetGame, setResetGame] = useState(false);

    function GameFinished(result:boolean, networkCall: boolean){
        // If game is already ended, don't process another end state
        if (gameEnded) {
            return;
        }

        setGameEnded(true);
        if (result === false){
            showToast("You lose");
            setWon(false);
        } else {
            showToast("You won!");
            setWon(true);
        }

        // Only send game result if this wasn't triggered by network
        if (!networkCall){
            SendGameResult(result);
        }
    }

    function SendGameResult(result:boolean){
        SendRequest({ id: "gr", content: !result } as GameData);
    }

    function ResetGameEndProps(){
        setResetGame((prev: any)=>!prev);
        setGameEnded(false);
        setWon(null);
    }

    return {
        won,
        GameFinished,
        ResetGameEndProps,
        gameEnded,
        resetGame,
    };
}