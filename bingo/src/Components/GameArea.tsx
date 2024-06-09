import { useCallback, useState } from "react";
import GridSizeDropDown from "./GridSizeDropDown";
import "./GameArea.css"
import { GameData, GridData, GridSize } from "../DataTypes";
import Grid from "./Grid";
import { useEffect, useRef} from "react";
import Peer, { DataConnection } from "peerjs";
import { v4 as uuidv4 } from 'uuid';
import { ConnectionsData } from "../DataTypes";
import PlayerConnect from "./PlayerConnect";
import ButtonArea from "./ButtonArea";
import { getRandomFillData, saveGridDataInLocal } from "../Helper";
function GameArea(){
    const [gridSizeLock, setGridSizeLock] = useState(false);
    const [gridSize,setGridSize] = useState<GridSize>(5);
    const [isGridFull,setIsGridFull]=useState(false);
    const peerRef= useRef<Peer | null>(null);
    const [userKey, _] = useState(uuidv4());
    const connRef = useRef<DataConnection | null>(null);
    const connRefPlayer2 = useRef<DataConnection | null>(null);
    const [connections, setConnections] = useState<ConnectionsData[]>([{ id: userKey, ready: false }]);
    const [isConnected, setIsConnected] = useState(false);
    const [allReady, setAllReady] = useState(false);
    const [selfReady, setSelfReady] = useState(false);
    const [yourTurn, setYourTurn] = useState<boolean|null>(null);
    const [gridData,setGridData]=useState<GridData[][]>(Array(gridSize).fill(null).map(() => Array(gridSize).fill({ number: '', struck: false } as GridData)));
    const [currentNumber,setCurrentNumber]=useState(1);
    const [won,setWon]=useState<boolean | null>(null);
    const [gameEnded,setGameEnded]=useState(false);
    const [resetGame, setResetGame]=useState(false);
    useEffect(() => {
        checkAllReady();
        }, [connections]);
        useEffect(() => {
            if (peerRef.current === null) {
              const peer = new Peer(userKey);
              peerRef.current = peer;
            }
            peerRef.current?.on("connection", (conn) => {
              if (connRefPlayer2.current === null) {
                connRefPlayer2.current = conn;
                setConnections((prevState) => [
                  ...prevState,
                  { id: conn.peer, ready: false },
                ]);
                setIsConnected(true);
              }
              conn.on("data", (data) => {
                handleGameData(data);
              });
              conn.on("open", () => conn.send({ id: "hello", content: userKey }));
              conn.on("error", handleConnectionError);
              conn.on("close", handleConnectionClose);
            });
          }, []);

          function handleSubmit(event: React.FormEvent<HTMLFormElement>, secondKey: string) {
            event.preventDefault();
            if (peerRef.current !== null) {
              if (connRef.current === null) {
                const conn = peerRef.current.connect(secondKey);
                setConnections((prevState) => [
                  ...prevState,
                  { id: secondKey, ready: false },
                ]);
                connRef.current = conn;
              }
              connRef.current.on("open", () => {
                setIsConnected(true);
                connRef.current?.send({ id: "gs", content: gridSize });
                setGridSizeLock(true);
              });
              connRef.current?.on("data", (data) => {
                console.log(gridData);
                handleGameData(data);
              });
              connRef.current?.on("error", handleConnectionError);
              connRef.current?.on("close", handleConnectionClose);
            }
          }

          const handleGameData = useCallback((data: any) => {
            const gameData: GameData = data as GameData;

            switch (gameData.id) {
              case "gs":
                setGridSize(gameData.content as GridSize);
                setGridSizeLock(true);
                break;
              case "rs":
                setConnections((prevState) =>
                  prevState.map((item) =>
                    item.id === gameData.content.id
                      ? { ...item, ready: gameData.content.ready }
                      : item
                  )
                );
                break;
              case "tn":
                setYourTurn(!gameData.content);
                break;
              case "ni":
                console.log(gridData);
                updateGridForPlayerTwo(gameData.content as string);
                break;
              case "gr":
                GameFinished(gameData.content as boolean);
                break;
              case "rg":
                ResetGame();
                break;
              default:
                break;
            }
          }, []);
          function strikeNumber(data: string) {
            connRef.current?.send({ id: "ni", content: data });
            connRefPlayer2.current?.send({ id: "ni", content: data });
            setYourTurn(!yourTurn);
            if (yourTurn) {
              connRef.current?.send({ id: "tn", content: false });
              connRefPlayer2.current?.send({ id: "tn", content: false });
            }
          }
          
          function updateGridForPlayerTwo(number: string) {
            setGridData((prevGridData) => {
              const newGridInfo = prevGridData.map((row) =>
                row.map((cell) =>
                  cell.number === number ? { ...cell, struck: true } : cell
                )
              );
              return newGridInfo;
            });
          }
      function GameFinished(won:boolean){
        setGameEnded(true);
        if (won===false){
            return;
        }
          setWon(true);
          connRef.current?.send({ id: "gr", content: false });
          connRefPlayer2.current?.send({id:"gr",content:false});
      }
      function checkAllReady(){
        if (connections.every(s => s.ready)) {
          setAllReady(true);
          toss();
        }
      };
      function toss(){
        const rndNum = Math.random();
        setYourTurn(rndNum >= 0.5);
        connRef.current?.send({ id: "tn", content: rndNum >= 0.5 });
      };
    
      function handleConnectionError(error: any){
        console.error("Connection error:", error);
        resetConnectionState()
      };
    
      const handleConnectionClose = () => {
        resetConnectionState()
      };
      function readySignal(){
        setConnections(prevState => prevState.map(item =>
          item.id === userKey ? { ...item, ready: true } : item
        ));
        setSelfReady(true);
        connRef.current?.send({ id: "rs", content: { id: userKey, ready: true } });
        connRefPlayer2.current?.send({ id: "rs", content: { id: userKey, ready: true } });
      };
    function checkReadyorEnded(){
      return (!isConnected && !allReady && gameEnded);
    }

    function undo(){
      const newGridInfo = gridData.map((row) =>
        row.map((cell) =>
          cell.number === (currentNumber-1).toString() ? { number:"",struck:false} : cell
        )
      );
      setGridData(newGridInfo);
      setCurrentNumber((prev)=>{
        return prev-1;
      });
    }
     function randomFill(){
       setGridData(getRandomFillData(gridSize));
     }
     function saveGrid(name:string){
      saveGridDataInLocal(gridData,name,gridSize);
     }
     function leaveGame(){
        connRef.current?.close();
        connRefPlayer2.current?.close();
        connRef.current=null;
        connRefPlayer2.current=null;
        resetConnectionState();
     }
     function resetConnectionState(){
        setResetGame(prev=>!prev);
        setGridSizeLock(false);
        setIsConnected(false);
        setAllReady(false);
        setSelfReady(false);
        setIsGridFull(false);
      };
    
     function resetAndSendSignal(){
        sendResetSignal();
        ResetGame()
      }
      function ResetGame(){
        setResetGame(prev=>!prev);
        setGridData(Array(gridSize).fill(null).map(() => Array(gridSize).fill({ number: '', struck: false } as GridData)));
        setIsGridFull(false);
        setAllReady(false);
        setSelfReady(false);
        setGameEnded(false);
        setWon(null);
        setConnections(prevState => prevState.map(item =>{
          return { ...item, ready:false};
        }));
      };
      function sendResetSignal(){
        connRef.current?.send({"id":"rg","content":null});
        connRefPlayer2.current?.send({"id":"rg","content":null});
      }
    return (
        <>
        <div className="App-grid">
            <GridSizeDropDown gridSize={gridSize}  setGridSize={setGridSize}  gridSizeLock={gridSizeLock} />
            <Grid 
              gridSize={gridSize} 
              gridData={gridData} 
              setGridData={setGridData}
              isGridFull={isGridFull} 
              setIsGridFull={setIsGridFull}
              currentNumber={currentNumber}
              setCurrentNumber={setCurrentNumber}
              isConnected={isConnected} 
              checkReadyorEnded={checkReadyorEnded} 
              strikeNumber={strikeNumber} 
              GameFinished={GameFinished} 
              yourTurn={yourTurn} 
              resetGame={resetGame} 
            />
            <PlayerConnect  isConnected={isConnected} resetGame={resetGame} handleSubmit={handleSubmit} userKey={userKey}/>
            {allReady && !gameEnded && (yourTurn===true ? <p>It's your turn</p> : <p>It's opponent's turn</p>)}
            {won!==null && (<>{won? (<h2>You won!</h2>):(<h2>You Lose</h2>)}</>)}
        </div>
        <ButtonArea saveGrid={saveGrid} undo={undo} currentNumber={currentNumber} resetAndSignal={resetAndSendSignal} leaveGame={leaveGame} randomFill={randomFill} gameEnded={gameEnded} isConnected={isConnected} isGridFull={isGridFull} allReady={allReady} selfReady={selfReady} readySignal={readySignal} />
        </>
    )
}
export default GameArea;