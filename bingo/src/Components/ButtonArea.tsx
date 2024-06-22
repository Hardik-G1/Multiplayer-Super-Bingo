import { useState ,useEffect} from "react";
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
    makeLoadSectionVisible:()=>void;
    clearGrid:()=>void;
  }
  
function ButtonArea({clearGrid,readySignal,leaveGame,isGridFull,isConnected,selfReady,allReady,randomFill,gameEnded,resetAndSignal,undo,currentNumber,saveGrid,makeLoadSectionVisible}:ButtonProps){
  const [saveBox,setSaveBox]=useState(false);
  const [name,setName]=useState("");
  const [showLoadScreenToggle,setShowLoadScreenToggle]=useState(false);
  const [undoDisabled, setUndoDisabled]=useState(false);
  function handleSaveClick(){
    setSaveBox(prev=>!prev);
  }
  function handleSubmit(e:React.FormEvent<HTMLFormElement>,name:string){
    e.preventDefault();
    saveGrid(name);
    setSaveBox(false);
    setName("");
  }
  useEffect(()=>{
    if(currentNumber>1){
      setUndoDisabled(false);
    } else{
      setUndoDisabled(true);
    }
  },[currentNumber]);
  function handleLoadClick(){
    makeLoadSectionVisible();
    setShowLoadScreenToggle(prev=>!prev);
  }
    return(
        <div className="App-buttons">
          {!allReady && selfReady && isConnected && <p>Waiting for other players....</p>}
          {allReady && !gameEnded && <h4>Game Started!</h4>}
          {isGridFull && !allReady && !selfReady && <button onClick={readySignal}>Ready</button>}
          {!selfReady && isConnected && !undoDisabled && <button onClick={undo}>Undo</button>}
          {!selfReady && isConnected && <button onClick={clearGrid}>Clear All</button>}
          {!selfReady && isConnected && <button onClick={randomFill}>Random Fill</button>}
          {isGridFull && !allReady && !selfReady && <button onClick={handleSaveClick}>{saveBox ? "Cancel Save":"Save Grid"}</button>}
          {saveBox && isGridFull && !allReady && !selfReady && (<div id="inputSection">
                <form onSubmit={(e)=>handleSubmit(e,name)}>
                  <label>Grid Name</label>
                <input  type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="(overwrite on same name)" />
                <button>Save Grid</button>
                </form>
                </div>)}
          {isGridFull && !allReady && !selfReady && <button onClick={handleLoadClick}>{showLoadScreenToggle ?"Close Load" :"Load Saved Grids"}</button>}
          {!isGridFull && !allReady && !selfReady }
          {gameEnded && <button onClick={resetAndSignal}>Reset</button>}
          {isConnected && <button onClick={leaveGame}>Leave Game</button>}
        </div>
    );
}
export default ButtonArea;