import { useState } from "react";
import "./ButtonArea.css";
export interface ButtonProps {
    readySignal: () => void;
    isGridFull:boolean;
    allReady:boolean;
    selfReady:boolean;
    isConnected:boolean;
    randomFill:()=>void;
    gameEnded:boolean;
    leaveGame:()=>void;
    resetAndSignal:()=>void;
    undo:()=>void;
    currentNumber:number;
    saveGrid:(name:string)=>void;
  }
  
function ButtonArea({readySignal,leaveGame,isGridFull,isConnected,selfReady,allReady,randomFill,gameEnded,resetAndSignal,undo,currentNumber,saveGrid}:ButtonProps){
  const [saveBox,setSaveBox]=useState(false);
  const [name,setName]=useState("");
  function handleClick(){
    setSaveBox(true);
  }
  function handleSubmit(e:React.FormEvent<HTMLFormElement>,name:string){
    e.preventDefault();
    saveGrid(name);
    setSaveBox(false);
  }
    return(
        <div className="App-buttons">
          {!allReady && selfReady && isConnected && <p>Waiting for other players....</p>}
          {allReady && !gameEnded && <h4>Game Started!</h4>}
          {isGridFull && !allReady && !selfReady && <button onClick={readySignal}>Ready</button>}
          {!selfReady && isConnected && currentNumber>1 && <button onClick={undo}>Undo</button>}
          {!selfReady && isConnected && <button onClick={randomFill}>Random Fill</button>}
          {isGridFull && !allReady && !selfReady && <button onClick={handleClick}>Save Grid</button>}
          {saveBox && isGridFull && !allReady && !selfReady && (<div id="inputSection">
                <form onSubmit={(e)=>handleSubmit(e,name)}>
                <input  type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter the Grid Name (will overwrite if same name present)" />
                <button>Submit</button>
                </form>
                </div>)}
          {gameEnded && <button onClick={resetAndSignal}>Reset</button>}
          {isConnected && <button onClick={leaveGame}>Leave Game</button>}
        </div>
    );
}
export default ButtonArea;