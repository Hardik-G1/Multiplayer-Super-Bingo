import { useCallback,  useEffect,  useState } from "react";
import Grid from "./Grid";
import "./GameArea.css";
import { usePeerConnection } from "./PeerConnectionHook";
import PlayerConnect from "./PlayerConnect";
import ButtonArea from "./ButtonArea";
import SavedGridsViewer from "./SavedGridsViewer";
import { TurnIndicator } from "./TurnIndicator";
import { WinnerIndicator } from "./WinnerIndicator";
import { useGameStats } from "./GameStats";
import { useGameConnnection } from "./GameConnection";
import { useGameEndHandler } from "./GameEndHandler";
import { GameData, GameSetup, GridSize } from "../DataTypes";
import { v4 as uuidv4 } from 'uuid';
  import { useTimer } from 'react-timer-hook';
function GameArea(){

  const [userKey, _] = useState(uuidv4());
  const [gridSizeLock, setGridSizeLock] = useState(false);
  const [gridSize,setGridSize] = useState<GridSize>(5);
  const [showLoadScreen,setShowLoadScreen]=useState(false);
  const [gameTime, setGameTime]=useState(0);
  const handleGameData = useCallback((data: any) => {
    const gameData: GameData = data as GameData;
    switch (gameData.id) {
      case "gs":
        HandleGameSetup(gameData.content as GameSetup);
        break;
      case "rs":
        HandlePlayersReady(gameData.content.id)
        break;
      case "tn":
        setYourTurn(!gameData.content);
        break;
      case "ni":
        updateGridForPlayerTwo(gameData.content as string);
        break;
      case "gr":
        GameFinished(gameData.content as boolean);
        break;
      case "rg":
        ResetGameProps();
        break;
      default:
        break;
    }
  }, []);


  const { handleSubmit, connRef, connRefPlayer2,ResetPeerConnection,sendToPeer } = usePeerConnection({
    userKey,
    handleGameData,
    HandleConnections,
    SendGameSetupData,
    leaveAndReset
  });
  const {
    yourTurn,
    setYourTurn,
    setConnections,
    setIsConnected,
    readySignal,
    HandlePlayersReady,
    isConnected,
    allReady,
    selfReady,
    DisconnectedFromPlayer,
    ResetPlayerConnectionStatus
  }=useGameConnnection(userKey,SendRequest);

  const {    
    gridData,
    setGridData,
    currentNumber,
    setCurrentNumber,
    undo,
    randomFill,
    saveGrid,
    clearGrid,
    isGridFull,
    setIsGridFull,
    strikeNumber,
    updateGridForPlayerTwo,
    GamePropsReset
  }=useGameStats(gridSize,SendRequest,yourTurn,setYourTurn);


  const {
    won,
    GameFinished,
    ResetGameProps,
    resetAndSendSignal,
    gameEnded,
    resetGame,
    leaveGame
  }=useGameEndHandler(SendRequest,ResetPeerConnection,DisconnectedFromPlayer,ResetPlayerConnectionStatus,GamePropsReset,sendResetSignal,HandleGridSize);
  function HandleConnections(key :string){
    setConnections((prevState) => [
      ...prevState,
      { id: key, ready: false },
    ]);
    setIsConnected(true);
  }
  function leaveAndReset(){
    leaveGame()
    ResetGameProps()
  }
  function sendResetSignal(){
    if (connRef && connRef.current?.peer!==userKey){
      connRef.current?.send({"id":"rg","content":null});
    } else if (connRefPlayer2){
      connRefPlayer2.current?.send({"id":"rg","content":null});
    }
  }
  function SendRequest(requestData: GameData){
      connRef.current?.send(requestData);
      connRefPlayer2.current?.send(requestData);
  }

  function SendGameSetupData() {
    sendToPeer({ id: "gs", content: {"gridSize":gridSize,"time":gameTime }})
    HandleGridSize(gridSize, true);
  }
function HandleGameSetup(gamedata: GameSetup){
  HandleGridSize(gamedata.gridSize, true);
  setGameTime(gamedata.time);
}
  function HandleGridSize(gridSize:GridSize,lock:boolean){
    setGridSize(gridSize);
    setGridSizeLock(lock);
  }

  function makeLoadSectionVisible(){
    setShowLoadScreen(prev=>!prev);
  }
  const times = new Date();
  times.setSeconds(times.getSeconds() + gameTime);
  const {
    seconds,
    minutes,
  } = useTimer({

    onExpire: () => console.warn('onExpire called'),
    expiryTimestamp: times
  });
  useEffect(()=>{

  },[resetGame,gameTime])
  return (
    <>
      <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '25px'}}>
        <span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </div>
      <div className="App-grid">
        <Grid 
          gridSize={gridSize} 
          gridData={gridData} 
          setGridData={setGridData}
          isGridFull={isGridFull} 
          setIsGridFull={setIsGridFull}
          currentNumber={currentNumber}
          setCurrentNumber={setCurrentNumber}
          isConnected={isConnected} 
          allReady={allReady}
          gameEnded={gameEnded}
          strikeNumber={strikeNumber} 
          GameFinished={GameFinished} 
          yourTurn={yourTurn} 
          resetGame={resetGame} 
        />
        <PlayerConnect  
          isConnected={isConnected} 
          resetGame={resetGame} 
          handleSubmit={handleSubmit} 
          userKey={userKey}
          gridSize={gridSize}  
          setGridSize={setGridSize}  
          gridSizeLock={gridSizeLock}
          time={gameTime}
          setTime={setGameTime}
        />

        <TurnIndicator
          allReady={allReady}
          gameEnded={gameEnded}
          yourTurn={yourTurn}
        />
        <WinnerIndicator 
          won={won}
        />
      </div>
      <ButtonArea  
        clearGrid={clearGrid} 
        makeLoadSectionVisible={makeLoadSectionVisible} 
        saveGrid={saveGrid} 
        undo={undo} 
        currentNumber={currentNumber} 
        resetAndSignal={resetAndSendSignal} 
        leaveGame={leaveAndReset} 
        randomFill={randomFill} 
        gameEnded={gameEnded} 
        isConnected={isConnected} 
        isGridFull={isGridFull} 
        allReady={allReady} 
        selfReady={selfReady} 
        readySignal={readySignal} 
      />
      <SavedGridsViewer 
        setGridData={setGridData} 
        gridSize={gridSize} 
        showLoadScreen={showLoadScreen} 
      />
    </>
  );
}
export default GameArea;