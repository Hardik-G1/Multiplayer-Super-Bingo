import { useCallback,  useEffect,  useRef,  useState } from "react";
import Grid from "./Grid";
import "./css/GameArea.css";
import { usePeerConnection } from "../Hooks/PeerConnectionHook";
import PlayerConnect from "./PlayerConnect";
import ButtonArea from "./ButtonArea";
import SavedGridsViewer from "./SavedGridsViewer";
import { TurnIndicator } from "./TurnIndicator";
import { WinnerIndicator } from "./WinnerIndicator";
import { useGameStats } from "../Hooks/GameStats";
import { useGameConnnection } from "../Hooks/GameConnection";
import { useGameEndHandler } from "../Hooks/GameEndHandler";
import { GameData, GameSetup, GridSize } from "../DataTypes";
import { v4 as uuidv4 } from 'uuid';
import CountdownTimer, { CountdownTimerHandle } from "./Timer";

function GameArea(){

  const [userKey, _] = useState(uuidv4());
  const [gridSizeLock, setGridSizeLock] = useState(false);
  const [gridSize,setGridSize] = useState<GridSize>(5);
  const [showLoadScreen,setShowLoadScreen]=useState(false);
  const [gameTime, setGameTime]=useState(0);
  const [isOrganiser,setIsOrganiser]=useState(false);
  const timerRef = useRef<CountdownTimerHandle>(null);
  const handleComplete = () => {
    console.log("Time's up!");
    if(allReady){
      GameFinished(false,false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      timerRef.current.startTimer();
    }
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      timerRef.current.pauseTimer();
    }
  };

  const resetTimer = (newTime: number) => {
    if (timerRef.current) {
      console.log(newTime)
      timerRef.current.resetTimer(newTime);
    }
  };

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
        HandleTurn(gameData)
        break;
      case "ni":
        updateGridForPlayerTwo(gameData.content as string);
        break;
      case "gr":
        GameFinished(gameData.content as boolean,true);
        break;
      case "rg":
        ResetGameProps();
        ResetGameTimer(gameData.content as number);
        break;
      default:
        break;
    }
  }, []);

  const { handleSubmit, connRef, connRefPlayer2,ResetPeerConnection,sendToPeer } = usePeerConnection({ 
    setOrganiser,
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
  }=useGameConnnection(isOrganiser,userKey,SendRequest,SendRequestToOther,startTimer);

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
  }=useGameStats(pauseTimer,gridSize,SendRequest,yourTurn,setYourTurn);


  const {
    won,
    GameFinished,
    ResetGameProps,
    resetAndSendSignal,
    gameEnded,
    resetGame,
    leaveGame
  }=useGameEndHandler(ResetGameTimer,gameTime,SendRequest,ResetPeerConnection,DisconnectedFromPlayer,ResetPlayerConnectionStatus,GamePropsReset,HandleGridSize);

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
    resetTimer(0);
    setGameTime(0);
  }
function HandleTurn(gameData:GameData){
  if (!gameData.content){
    setYourTurn(true);
    startTimer();
  }else{
    setYourTurn(false);
  }
}
  function ResetGameTimer(gameTimer: number){
    resetTimer(gameTimer);
  }
function setOrganiser(){
  setIsOrganiser(true);
}
  function SendRequest(requestData: GameData){
      connRef.current?.send(requestData);
      connRefPlayer2.current?.send(requestData);
  }

  function SendRequestToOther(requestData: GameData){
    connRef.current?.send(requestData);
}
  function HandleGridSize(gridSize:GridSize,lock:boolean){
    setGridSize(gridSize);
    setGridSizeLock(lock);
  }

  function makeLoadSectionVisible(){
    setShowLoadScreen(prev=>!prev);
  }

  useEffect(()=>{
    console.log("sad");
  },[resetGame]
)
useEffect(()=>{
  console.log("sad");
},[isConnected]
)
  useEffect(()=>{
    console.log(gameTime);
  },[gameTime])
  function SendGameSetupData() {
    sendToPeer({ id: "gs", content: {"gridSize":gridSize,"duration":gameTime }})
    HandleGridSize(gridSize, true);
  }
function HandleGameSetup(gamedata: GameSetup){
  HandleGridSize(gamedata.gridSize, true);
  setGameTime(gamedata.duration);
  resetTimer(gamedata.duration)
}
  return (
    <>
      <div className="App-grid">
      {isConnected && gameTime>0 &&
        <CountdownTimer ref={timerRef} initialTime={gameTime} onComplete={handleComplete} />
      }
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
     {isConnected && <><ButtonArea  
        clearGrid={clearGrid} 
        makeLoadSectionVisible={makeLoadSectionVisible} 
        saveGrid={saveGrid} 
        undo={undo} 
        currentNumber={currentNumber} 
        resetAndSendSignal={resetAndSendSignal} 
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
      /></>}
    </>
  );
}
export default GameArea;

