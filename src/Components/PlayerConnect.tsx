"use client"

import { SetStateAction, useEffect, useState } from "react";
import "./css/PlayerConnect.css";
import { GridSize } from "../DataTypes";
import GameSetup from "./GameSetup";
import { showToast } from "../Helper";
interface ConnectProps {
    userKey: string;
    handleSubmit: (key:string) => void;
    resetGame:boolean;
    isConnected: boolean;
    gridSize:GridSize;
    setGridSize: React.Dispatch<SetStateAction<GridSize>>;
    time: number; 
    setTime: React.Dispatch<SetStateAction<number>>; 
  }
  
function PlayerConnect({userKey,handleSubmit,resetGame, isConnected,gridSize,setGridSize,time,setTime}:ConnectProps){
    const [isOrganiser,setIsOrganiser]=useState<boolean|null>(null);
    const [secondKey,setSecondKey]=useState("");
    const [showSetup, setShowSetup] = useState(false)
    const [isTimeMatched, setIsTimeMatched] = useState(false);
      const [isMobile, setIsMobile] = useState(false);
    

    const handleStartGame = (secondKey:string) => {
        handleSubmitClick(secondKey);
      }
    function handleSubmitClick(secondKey:string){
        if (!(secondKey && secondKey.trim())){
            showToast("Please paste a player Key");
            return;
        }
        if (isTimeMatched && time === 0){
            showToast("Please select a time");
            return;
        }
        handleSubmit(secondKey.trim())
        setIsOrganiser(null);
        setSecondKey("");
        setShowSetup(false)
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

  // Add mobile check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
    return (
        <>
        {!isConnected &&  isMobile && (
                <div style={{
                  backgroundColor: '#ffd700',
                  color: '#000',
                  textAlign: 'center',
                  padding: '8px',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  Please use WiFi connection to play the game.
                </div>
              )}
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
// import GridSizeDropDown from "./GridSizeDropDown";
// import TimerToggle from "./TimerToggle";
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