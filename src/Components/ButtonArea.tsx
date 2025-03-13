import { useState, useEffect } from "react";
import "./css/ButtonArea.css";

export interface ButtonProps {
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
  makeLoadSectionVisible: () => void;
  clearGrid: () => void;
}

function ButtonArea({
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
    makeLoadSectionVisible();
    setShowLoadScreenToggle(prev => !prev);
  };

  const renderWaitingMessage = () => {
    return !allReady && selfReady && isConnected && <p>Waiting for other players....</p>;
  };

  const renderGameStartedMessage = () => {
    return allReady && !gameEnded && <h4>Game Started!</h4>;
  };

  const renderReadyButton = () => {
    return isGridFull && !allReady && !selfReady && <button onClick={readySignal}>Ready</button>;
  };

  const renderSaveButton = () => {
    return isGridFull && !allReady && !selfReady && (
      <>
        <button onClick={handleSaveClick}>{saveBox ? "Cancel Save" : "Save Grid"}</button>
        {saveBox && (
          <div id="inputSection">
            <form onSubmit={handleSubmit}>
              <label>Grid Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="(overwrite on same name)"
              />
              <button>Save Grid</button>
            </form>
          </div>
        )}
      </>
    );
  };

  const renderLoadButton = () => {
    return isConnected && !allReady && !selfReady && (
      <button onClick={handleLoadClick}>
        {showLoadScreenToggle ? "Close Load" : "Load Saved Grids"}
      </button>
    );
  };

  const renderGameControlButtons = () => {
    return !selfReady && isConnected && (
      <>
        {!undoDisabled && <button onClick={undo}>Undo</button>}
        {currentNumber>1 && <button onClick={clearGrid}>Clear All</button>}
        <button onClick={randomFill}>Random Fill</button>
      </>
    );
  };

  const renderResetButton = () => {
    return gameEnded && <button onClick={()=>restartGame(true)}>Restart Game</button>;
  };

  const renderLeaveGameButton = () => {
    return isConnected && <button onClick={gameReset}>Leave Game</button>;
  };

  return (
    <div className="App-buttons">
      {renderWaitingMessage()}
      {renderGameStartedMessage()}
      {renderReadyButton()}
      {renderSaveButton()}
      {renderLoadButton()}
      {renderGameControlButtons()}
      {renderResetButton()}
      {renderLeaveGameButton()}
    </div>
  );
}

export default ButtonArea;
