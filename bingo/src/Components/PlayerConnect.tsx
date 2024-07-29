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
    showToast:(message:string)=>void;
  }
function PlayerConnect({userKey,handleSubmit,resetGame, isConnected,gridSize,setGridSize,gridSizeLock,time,setTime,showToast}:ConnectProps){
    const [isOrganiser,setIsOrganiser]=useState<boolean|null>(null);
    const [secondKey,setSecondKey]=useState("");

    function handleOrganiser(wantsOrganiser:boolean){
        if (wantsOrganiser){
            setIsOrganiser(true);
            return;
        }
        setIsOrganiser(false);
    }
    function handleSubmitClick(e: React.FormEvent<HTMLFormElement>,secondKey:string){
        e.preventDefault();
        if (!(secondKey && secondKey.trim())){
            showToast("Please paste a player Key");
            return;
        }
        handleSubmit(e,secondKey.trim())
        setIsOrganiser(null);
        setSecondKey("");
    }
    
    useEffect(()=>{
        setIsOrganiser(null);
    },[resetGame,isConnected]);
    return (
        <>
        {!isConnected &&
        <div className="containera">
            <button onClick={()=>handleOrganiser(true)} className="button">
                Setup a Game
            </button>
            <button onClick={()=>handleOrganiser(false)} className="button">
                Show Key
            </button>
            <button className="button"
            onClick={() =>  {navigator.clipboard.writeText(userKey);showToast("Key copied to clipboard.")}}
            >
            Copy Key
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