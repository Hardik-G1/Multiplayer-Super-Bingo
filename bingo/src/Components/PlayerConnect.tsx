import { SetStateAction, useEffect, useState } from "react";
import "./css/PlayerConnect.css";
import { GridSize } from "../DataTypes";
import GridSizeDropDown from "./GridSizeDropDown";
import TimerToggle from "./TimerToggle";
interface ConnectProps {
    userKey: string;
    handleSubmit: (event:React.FormEvent<HTMLFormElement>,key:string) => void;
    resetGame:boolean;
    isConnected: boolean;
    gridSize:GridSize;
    setGridSize: React.Dispatch<SetStateAction<GridSize>>;
    gridSizeLock:boolean;
    time: number; 
    setTime: React.Dispatch<SetStateAction<number>>; 
  }
function PlayerConnect({userKey,handleSubmit,resetGame, isConnected,gridSize,setGridSize,gridSizeLock,time,setTime}:ConnectProps){
    const [isOrganiser,setIsOrganiser]=useState<boolean|null>(null);
    const [secondKey,setSecondKey]=useState("");

    function handleClick(playerType:number){
        if (playerType==1){
            setIsOrganiser(true);
        }else{
            setIsOrganiser(false);
        }
    }
    function handleSubmitClick(e: React.FormEvent<HTMLFormElement>,secondKey:string){
        handleSubmit(e,secondKey.trim())
        setIsOrganiser(null);
        setSecondKey("");
    }
    useEffect(()=>{
        setIsOrganiser(null);
    },[resetGame,isConnected]);
    return (
        <>{!isConnected &&
        <div className="containera">
            <button onClick={()=>handleClick(1)} className="button">
                Setup a Game
            </button>
            <button onClick={()=>handleClick(2)} className="button">
                Show Key
            </button>
            {isOrganiser && !gridSizeLock && (
                <div id="inputSection" className="dropdown-container">
                    <GridSizeDropDown 
                    gridSize={gridSize}  
                    setGridSize={setGridSize}  
                    />
                <TimerToggle 
                    time={time} 
                    setTime={setTime}
                />
                <form onSubmit={(e)=>handleSubmitClick(e,secondKey)}>
                <input  type="text"
                    value={secondKey}
                    onChange={(e) => setSecondKey(e.target.value)}
                    placeholder="Enter other player key..." />
                <button>Submit</button>
                </form>
                </div>
            )}{isOrganiser===false &&(
                <div id="textSection">
                <p>This is your key {userKey}</p>
                </div>
            )}
        </div>}
        </>
    )
}
export default PlayerConnect;