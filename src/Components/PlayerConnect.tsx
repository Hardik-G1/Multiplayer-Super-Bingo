"use client"

import { SetStateAction, useEffect, useState } from "react";
import "./css/PlayerConnect.css";
import { GridSize } from "../DataTypes";
import GridSizeDropDown from "./GridSizeDropDown";
import TimerToggle from "./TimerToggle";
import GameSetup from "./GameSetup";
interface ConnectProps {
    userKey: string;
    handleSubmit: (key:string) => void;
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
    const [showSetup, setShowSetup] = useState(false)
    const [isTimeMatched, setIsTimeMatched] = useState(false);
    

    const handleStartGame = (secondKey:string) => {
        setShowSetup(false)
        handleSubmitClick(secondKey);
      }
    function handleSubmitClick(secondKey:string){
        if (!(secondKey && secondKey.trim())){
            showToast("Please paste a player Key");
            return;
        }
        handleSubmit(secondKey.trim())
        setIsOrganiser(null);
        setSecondKey("");
    }
    
    function handleOrganiser(wantsOrganiser:boolean){
        if (wantsOrganiser){
            setIsOrganiser(true);
            return;
        }
        setIsOrganiser(false);
    }

    useEffect(()=>{
        setIsOrganiser(null);
    },[resetGame,isConnected]);

    return (
        <>
        {!isConnected && 
    <div className="main-menu">
      <button className="btn primary-btn" onClick={()=>setShowSetup(true)}>
        <span className="icon">⊞</span> Setup a Game
      </button>
    <button onClick={() => handleOrganiser(!isOrganiser)} className="btn secondary-btn">
      <span className="icon">{isOrganiser ? '🔒' : '🔑'}</span> {isOrganiser ? 'Hide Key' : 'Show Key'}
    </button>
      <button  onClick={() =>  {navigator.clipboard.writeText(userKey);showToast("Key copied to clipboard.")}} className="btn secondary-btn">
        <span className="icon">📋</span> Copy Key
      </button>
    </div>}
    {isOrganiser && (<center>This is your key {userKey}</center>)}
    {showSetup && (
        <GameSetup
          gridSize={gridSize}
          setGridSize={setGridSize}
          gameKey={secondKey}
          setGameKey={setSecondKey}
          timedMatch={isTimeMatched}
          setTimedMatch={setIsTimeMatched}
          setSelectedTime={setTime}
          selectedTime={time}
          onStartGame={()=>handleStartGame(secondKey)}
          onClose={() => setShowSetup(false)}
        />
      )}
    </>
    )
}

export default PlayerConnect;



//old code remove when main page completely done
// {!isConnected &&
//     <div className="containera">
//         <button onClick={()=>handleOrganiser(true)} className="button">
//             Setup a Game
//         </button>
//         {isOrganiser && !gridSizeLock && (
//             <div id="inputSection" className="dropdown-container">
//                 <GridSizeDropDown 
//                 gridSize={gridSize}  
//                 setGridSize={setGridSize}  
//                 />
//             <TimerToggle 
//                 time={time} 
//                 setTime={setTime}
//             />
//             <form onSubmit={()=>handleSubmitClick(secondKey)}>
//             <input  type="text"
//                 value={secondKey}
//                 onChange={(e) => setSecondKey(e.target.value)}
//                 placeholder="Enter other player key..." />
//             <button>Submit</button>
//             </form>
//             </div>
//         )}{isOrganiser===false &&(
//             <div id="textSection">   
//             <p>This is your key {userKey}</p>
//             </div>
//         )}
//     </div>}