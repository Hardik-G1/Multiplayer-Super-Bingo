"use client"

import { useEffect, useState } from "react";


interface ButtonProps {
  readySignal: () => void;
  isGridFull: boolean;
  allReady: boolean;
  selfReady: boolean;
  isConnected: boolean;
  randomFill: () => void;
  gameEnded: boolean;
  gameReset: () => void;
  restartGame: (sendRequest:boolean) => void;
  undo: () => void;
  currentNumber: number;
  saveGrid: (name: string) => void;
  makeLoadSectionVisible: (hide:boolean) => void;
  clearGrid: () => void;
}

export default function ControlPanel({
  clearGrid,
  readySignal,
  gameReset,
  isGridFull,
  isConnected,
  selfReady,
  allReady,
  randomFill,
  gameEnded,
  restartGame,
  undo,
  currentNumber,
  saveGrid,
  makeLoadSectionVisible
}: ButtonProps) {


  const [saveBox, setSaveBox] = useState(false);
  const [name, setName] = useState("");
  const [showLoadScreenToggle, setShowLoadScreenToggle] = useState(false);
  const [undoDisabled, setUndoDisabled] = useState(false);

  useEffect(() => {
    setUndoDisabled(currentNumber <= 1);
  }, [currentNumber]);

  const handleSaveClick = () => {
    setSaveBox(prev => !prev);
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveGrid(name);
    setSaveBox(false);
    setName("");
  };


  const handleLoadClick = () => {
    makeLoadSectionVisible(false);
    setShowLoadScreenToggle(prev => !prev);
  };
  const ReadySignal=()=>{
    readySignal();
    makeLoadSectionVisible(true);
    setShowLoadScreenToggle(false);
  }
  const renderWaitingMessage = () => {
    return !allReady && selfReady && isConnected && <center>Waiting for other players</center>;
  };

  const renderGameStartedMessage = () => {
    return allReady && !gameEnded && <center><h4>Game Started!</h4></center>;
  };

  const renderReadyButton = () => {
    return isGridFull && !allReady && !selfReady && <button className="btn dark-btn" onClick={ReadySignal}>Ready</button>;
  };

  const renderSaveButton = () => {
    return isGridFull && !allReady && !selfReady && (
      <>
        <button className="btn blue-btn" onClick={handleSaveClick}>{saveBox ? "Cancel Save" : "Save Grid"}</button>
        {saveBox && (
          <div className="form-group">
            <form onSubmit={handleSubmit}>
              <label>Grid Name</label>
              <input
               className="text-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="(overwrite on same name)"
              />
              <button className="btn dark-btn">Save Grid</button>
            </form>
          </div>
        )}
      </>
    );
  };

  const renderLoadButton = () => {
    return isConnected && !allReady && !selfReady && (
      <button className="btn blue-btn" onClick={handleLoadClick}>
        {showLoadScreenToggle ? "Close Grids" : "Load Grids"}
      </button>
    );
  };

  const renderGameControlButtons = () => {
    return !selfReady && isConnected && (
      <>
        {!undoDisabled && <button className="btn dark-btn" onClick={undo}>Undo</button>}
        {currentNumber>1 && <button  className="btn dark-btn" onClick={clearGrid}>Clear All</button>}
        <button className="btn blue-btn" onClick={randomFill}>Random Fill</button>
      </>
    );
  };

  const renderResetButton = () => {
    return gameEnded && <button className="btn dark-btn" onClick={()=>restartGame(true)}>Restart Game</button>;
  };

  const renderLeaveGameButton = () => {
    return isConnected && <button className="btn blue-btn" onClick={gameReset}>Leave Game</button>;
  };


  return (
    <div className="game-column controls-column">
      {renderWaitingMessage()}
      {renderGameStartedMessage()}
      {renderReadyButton()}
      {renderLoadButton()}
      {renderSaveButton()}
      {renderGameControlButtons()}
      {renderResetButton()}
      {renderLeaveGameButton()}
    </div>
  )
}
