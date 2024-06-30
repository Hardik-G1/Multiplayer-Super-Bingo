import { SetStateAction, useEffect, useState } from "react";
import "./PlayerConnect.css";
import { GridSize } from "../DataTypes";
import GridSizeDropDown from "./GridSizeDropDown";
interface ConnectProps {
    userKey: string;
    handleSubmit: (event:React.FormEvent<HTMLFormElement>,key:string) => void;
    resetGame:boolean;
    isConnected: boolean;
    gridSize:GridSize;
    setGridSize: React.Dispatch<SetStateAction<GridSize>>;
    gridSizeLock:boolean;
  }
function PlayerConnect({userKey,handleSubmit,resetGame, isConnected,gridSize,setGridSize,gridSizeLock}:ConnectProps){
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
        handleSubmit(e,secondKey)
        setIsOrganiser(null);
        setSecondKey("");
    }
    useEffect(()=>{
        setIsOrganiser(null);
    },[resetGame,isConnected]);
    return (
        <>{!isConnected &&
        <div className="container">
            <button onClick={()=>handleClick(1)} className="button">
                Setup a Game
            </button>
            <button onClick={()=>handleClick(2)} className="button">
                Get Key
            </button>
            {isOrganiser && (
                <div id="inputSection">
                    <GridSizeDropDown 
                    gridSize={gridSize}  
                    setGridSize={setGridSize}  
                    gridSizeLock={gridSizeLock}
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