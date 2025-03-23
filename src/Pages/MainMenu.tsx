import { useCallback,  useEffect,  useRef,  useState } from "react";
import { usePeerConnection } from "../Hooks/PeerConnectionHook";
import PlayerConnect from "../Components/PlayerConnect";
import { useGameStats } from "../Hooks/GameStats";
import { useGameConnnection } from "../Hooks/GameConnection";
import { useGameEndHandler } from "../Hooks/GameEndHandler";
import { GameData, GameSetup, GridData, GridSize } from "../DataTypes";
import { v4 as uuidv4 } from 'uuid';
import { showToast } from "../Helper";
import ControlPanel from "../Components/ControlPanel";
import SavedCards from "../Components/SavedCards";
import BingoGrid from "../Components/BingoGrid";
import { CountdownTimerHandle } from "../Components/Timer";

export default function MainMenu(){
  const [userKey, _] = useState(uuidv4());
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
        pauseTimer();
        break;
      case "reset-game":
        restartGame(false);
        break;
      case "ws":
          showToast("Opponent striked "+ gameData.content as string);
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
    gameReset
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
  }=useGameStats(pauseTimer,gridSize,SendRequest,yourTurn,setYourTurn);

  const {
    won,
    GameFinished,
    ResetGameEndProps,
    gameEnded,
    resetGame,
  }=useGameEndHandler(SendRequest);

  function HandleConnections(key :string){
    setConnections((prevState) => [
      ...prevState,
      { id: key, ready: false },
    ]);
    setIsConnected(true);
  }
  function resetGameProps(){
    ResetGameEndProps()
    ResetPlayerConnectionStatus()
    setGridData(Array(gridSize).fill(null).map(() => Array(gridSize).fill({ number: '', struck: false } as GridData)));
    setIsGridFull(false);
    setCurrentNumber(1);
  }
  function restartGame(sendRequest:boolean){
    if (sendRequest){
      SendRequest({"id":"reset-game","content":gameTime} as GameData);
    }
    showToast("Restarted the Game");
    resetGameProps();
    ResetGameTimer(gameTime);
  }
  function gameReset(){
    HandleGridSize(5 as GridSize);
    setIsConnected(false);
    resetTimer(0);
    setGameTime(0);
    resetGameProps();
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
  function SendWordStrikedFromOpponent(data:string){
    SendRequest({ id: "ws", content: data});
  }
  function SendRequestToOther(requestData: GameData){
    connRef.current?.send(requestData);
  }
  function HandleGridSize(gridSize:GridSize){
    setGridSize(gridSize);
    // setGridSizeLock(lock);,lock:boolean
  }

  function makeLoadSectionVisible(hide:boolean){
    if (hide){
      setShowLoadScreen(false);
    }else{
    setShowLoadScreen(prev=>!prev);
    }
  }

  useEffect(()=>{},[isConnected,resetGame,gameTime])

  function SendGameSetupData() {
    sendToPeer({ id: "gs", content: {"gridSize":gridSize,"duration":gameTime }})
    HandleGridSize(gridSize);
  }
  function HandleGameSetup(gamedata: GameSetup){
    HandleGridSize(gamedata.gridSize);
    setGameTime(gamedata.duration);
    resetTimer(gamedata.duration)
  }
  return (
    <div>
        <PlayerConnect  
          isConnected={isConnected} 
          resetGame={resetGame} 
          handleSubmit={handleSubmit} 
          userKey={userKey}
          gridSize={gridSize}  
          setGridSize={setGridSize}  
          time={gameTime}
          setTime={setGameTime}
        />

       {isConnected && 
       <div className="game-content">
        <div className="game-container">
        <BingoGrid 
          gridSize={gridSize} 
          gridData={gridData} 
          setGridData={setGridData}
          isGridFull={isGridFull} 
          setIsGridFull={setIsGridFull}
          currentNumber={currentNumber}
          setCurrentNumber={setCurrentNumber}
          isConnected={isConnected} 
          gameEnded={gameEnded}
          strikeNumber={strikeNumber} 
          GameFinished={GameFinished} 
          yourTurn={yourTurn} 
          resetGame={resetGame} 
          SendWordStrikedFromOpponent={SendWordStrikedFromOpponent} 
          ref={timerRef} 
          initialTime={gameTime}
          onComplete={handleComplete}
          allReady={allReady}
          won={won}
        />

          <ControlPanel  
            clearGrid={clearGrid} 
            makeLoadSectionVisible={makeLoadSectionVisible} 
            saveGrid={saveGrid} 
            undo={undo} 
            currentNumber={currentNumber} 
            restartGame={restartGame} 
            gameReset={ResetPeerConnection} 
            randomFill={randomFill} 
            gameEnded={gameEnded} 
            isConnected={isConnected} 
            isGridFull={isGridFull} 
            allReady={allReady} 
            selfReady={selfReady} 
            readySignal={readySignal}
          />
          <SavedCards
            setGridData={setGridData} 
            gridSize={gridSize} 
            showLoadScreen={showLoadScreen}  
          />
        </div>
      </div>
      
      }
    </div>
  )
}



