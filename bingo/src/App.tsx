import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { DataConnection, Peer } from "peerjs";
import { v4 as uuidv4 } from 'uuid';
import { ConnectionsData, GameData, GridData, GridSize,wordsMapping } from './DataTypes';
import { GameInfo } from './GameInfo';
import { WordWithStrikes } from './WordWithStrikes';
import { ReadySignal } from './ReadySignal';

function App() {
  const [gridSizeLock, setGridSizeLock] = useState(false);
  const [secondKey, setSecondKey] = useState("");
  const [userKey, _] = useState(uuidv4());
  const peerRef= useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const connRefPlayer2 = useRef<DataConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOrganiser, setIsOrganiser] = useState(0);
  const [connections, setConnections] = useState<ConnectionsData[]>([{ id: userKey, ready: false }]);
  const [allReady, setAllReady] = useState(false);
  const [selfReady, setSelfReady] = useState(false);
  const [yourTurn, setYourTurn] = useState<boolean|null>(null);
  const [gridSizeRef,setGridSizeRef] = useState<GridSize>(5);
  const gridInfoRef = useRef<GridData[][]>(Array(gridSizeRef).fill(null).map(() => Array(gridSizeRef).fill({ number: '', struck: false } as GridData)));
  const [won,setWon]=useState<boolean | null>(null);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isGridFull, setIsGridFull] = useState(false);
  const [linesCount, setLinesCount] = useState(0);
  const [gameEnded,setGameEnded]=useState(false);


  const word = wordsMapping[gridSizeRef];
  //making a peer
  useEffect(() => {
    if (peerRef.current === null) {
      const peer = new Peer(userKey);
      peerRef.current=peer;
    }
    peerRef.current?.on("connection", (conn) => {
      if (connRefPlayer2.current === null) {
        connRefPlayer2.current=conn;
        setConnections(prevState => [...prevState, { id: conn.peer, ready: false }]);
        setIsConnected(true);
      }
      conn.on("data", handleGameData);
      conn.on("open", () => conn.send({ id: "hello", content: userKey }));
      conn.on("error", handleConnectionError);
      conn.on("close", handleConnectionClose);
    });
  
  }, []);

  //when a number is changed update
  useEffect(() => {
    checkIfGridIsFull();
    checkForLines();
  }, [gridInfoRef.current]);
  
  //check if all ready
  useEffect(() => {
    checkAllReady();
  }, [connections]);

  //check if won
  useEffect(() => {
    checkIfWon();
    console.log(won);
  }, [linesCount,won]);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (peerRef.current!==null) {
      if (connRef.current === null) {
        const conn = peerRef.current.connect(secondKey);
        setConnections(prevState => [...prevState, { id: secondKey, ready: false }]);
        connRef.current=conn;
      }
      console.log(peerRef);
      console.log(connRef);
      connRef.current.on("open", () => {
        setIsConnected(true);
        connRef.current?.send({ id: "gs", content: gridSizeRef });
        setGridSizeLock(true);
      });
      connRef.current?.on("data", handleGameData);
      connRef.current?.on("error", handleConnectionError);
      connRef.current?.on("close", handleConnectionClose);
    }
  };

  const handleGameData = (data: any) => {
    const gameData: GameData = data as GameData;
    console.log(gameData);
    switch (gameData.id) {
      case "gs":
        setGridSizeRef(gameData.content as GridSize);
        gridInfoRef.current=Array(gridSizeRef).fill(null).map(() => Array(gridSizeRef).fill({ number: '', struck: false } as GridData));
        setGridSizeLock(true);
        setIsConnected(true);
        break;
      case "rs":
        setConnections(prevState => prevState.map(item =>
          item.id === gameData.content.id ? { ...item, ready: gameData.content.ready } : item
        ));
        break;
      case "tn":
        setYourTurn(!gameData.content);
        break;
      case "ni":
        updateGridForPlayerTwo(gameData.content as string);
        break;
      case "gr":
        setWon(gameData.content as boolean);
        break;
      case "rg":
          ResetGame()
          break;    
      default:
        break;
    }
  };


  const handleConnectionError = (error: any) => {
    console.error("Connection error:", error);
    resetConnectionState();
  };

  const handleConnectionClose = () => {
    resetConnectionState();
  };


  function checkIfWon(){
    if(linesCount >= word.length){
      setGameEnded(true);
      setWon(true);
      connRef.current?.send({ id: "gr", content: false });
      connRefPlayer2.current?.send({id:"gr",content:false});
    } else if (won===false){
      setGameEnded(true);
    } 
  }
  const checkIfGridIsFull = () => {
    const isFull = gridInfoRef.current.every(row => row.every(cell => cell.number !== ''));
    setIsGridFull(isFull);
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!isConnected && !allReady && gameEnded) return;

    if (gridInfoRef.current[rowIndex][colIndex].number === '') {
      const newGridData = gridInfoRef.current.map((row, rIdx) =>
        row.map((cell, cIdx) => ((rIdx === rowIndex && cIdx === colIndex) ? { number: currentNumber.toString(), struck: false } : cell))
      );
      gridInfoRef.current=newGridData;
      setCurrentNumber(currentNumber + 1);
    } else if (isGridFull && yourTurn===true && checkIsNotAlreadyStriked(rowIndex,colIndex)) {
      const newStruckThrough = gridInfoRef.current.map((row, rIdx) =>
        row.map((cell, cIdx) => ((rIdx === rowIndex && cIdx === colIndex && !cell.struck) ? { ...cell, struck: true } : cell))
      );
      strikeNumber(gridInfoRef.current[rowIndex][colIndex].number);
      gridInfoRef.current=newStruckThrough;
      checkForLines();
    }
  };

  function checkIsNotAlreadyStriked(rowIndex: number, colIndex: number){
    return !gridInfoRef.current[rowIndex][colIndex].struck;
  }
  const checkForLines = () => {
    let count = 0;

    // Check rows
    for (let row of gridInfoRef.current) {
      if (row.every(cell => cell.struck)) count++;
    }

    // Check columns
    for (let col = 0; col < gridSizeRef; col++) {
      let colFull = true;
      for (let row = 0; row < gridSizeRef; row++) {
        if (!gridInfoRef.current[row][col].struck) {
          colFull = false;
          break;
        }
      }
      if (colFull) count++;
    }

    // Check diagonals
    let diag1Full = true;
    let diag2Full = true;
    for (let i = 0; i < gridSizeRef; i++) {
      if (!gridInfoRef.current[i][i].struck) diag1Full = false;
      if (!gridInfoRef.current[i][gridSizeRef - 1 - i].struck) diag2Full = false;
    }
    if (diag1Full) count++;
    if (diag2Full) count++;

    setLinesCount(count);
  };
  function sendResetSignal(){
    connRef.current?.send({"id":"rg","content":null});
    connRefPlayer2.current?.send({"id":"rg","content":null});
  }
  function resetAndSendSignal(){
    sendResetSignal();
    ResetGame()
  }
  const ResetGame = () => {
    gridInfoRef.current=Array(gridSizeRef).fill(null).map(() => Array(gridSizeRef).fill({ number: '', struck: false } as GridData));
    setCurrentNumber(1);
    setIsGridFull(false);
    setLinesCount(0);
    setAllReady(false);
    setSelfReady(false);
    setGameEnded(false);
    setWon(null);
    setConnections(prevState => prevState.map(item =>{
      return { ...item, ready:false};
    }));
  };
  const resetConnectionState = () => {
    setIsOrganiser(0);
    setGridSizeLock(false);
    setIsConnected(false);
    setAllReady(false);
    setSelfReady(false);
    setIsGridFull(false);
  };

  const updateGridForPlayerTwo = (number: string) => {
    const newGridInfo = gridInfoRef.current.map(row =>
      row.map(cell => cell.number === number ? { ...cell, struck: true } : cell)
    );
    gridInfoRef.current=newGridInfo;
  };

  const readySignal = () => {
    setConnections(prevState => prevState.map(item =>
      item.id === userKey ? { ...item, ready: true } : item
    ));
    setSelfReady(true);
    connRef.current?.send({ id: "rs", content: { id: userKey, ready: true } });
    connRefPlayer2.current?.send({ id: "rs", content: { id: userKey, ready: true } });
  };

  const strikeNumber = (data: string) => {
    connRef.current?.send({ id: "ni", content: data });
    connRefPlayer2.current?.send({ id: "ni", content: data });
    setYourTurn(!yourTurn);
    if (yourTurn) {
      connRef.current?.send({ id: "tn", content: false });
      connRefPlayer2.current?.send({ id: "tn", content: false });
    }
  };

  const leaveGame = () => {
    connRef.current?.close();
    connRefPlayer2.current?.close();
    connRef.current=null;
    connRefPlayer2.current=null;
    resetConnectionState();
  };

  const setupGame = () => {
    setIsOrganiser(1);
  };

  const joinGame = () => {
    setIsOrganiser(2);
  };

  const checkAllReady = () => {
    if (connections.every(s => s.ready)) {
      setAllReady(true);
      toss();
    }
  };

  const toss = () => {
    const rndNum = Math.random();
    setYourTurn(rndNum >= 0.5);
    connRef.current?.send({ id: "tn", content: rndNum >= 0.5 });
  };

  function randomFill(){
   
    gridInfoRef.current=Array(gridSizeRef).fill(null).map(() => Array(gridSizeRef).fill({ number: '', struck: false } as GridData)) as GridData[][];
      // Create an array of numbers from 1 to n^2
      let numbers = Array.from({ length: gridSizeRef*gridSizeRef }, (_, i) => i + 1);
  
      // Shuffle the numbers array using Fisher-Yates algorithm
      for (let i = numbers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }

      // Initialize an empty array to hold the matrix
      let matrix = [];

      // Fill the matrix with the shuffled numbers
      for (let i = 0; i < gridSizeRef; i++) {
          let row = [];
          for (let j = 0; j < gridSizeRef; j++) {
             let data={"number":"1","struck":false} as GridData;
              data.number=numbers[i * gridSizeRef + j].toString();
              row.push(data);
          }
          matrix.push(row);
      }
      gridInfoRef.current=matrix as GridData[][];
      setIsGridFull(prev=>!prev);

  }

  const handleGridSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10) as GridSize;
    setGridSizeRef(newSize);
    gridInfoRef.current=Array(newSize).fill(null).map(() => Array(newSize).fill({ number: '', struck: false } as GridData));
  };

  return (
    <div className="App">
      <h1>Grid Input App</h1>
      {!gridSizeLock && (
        <div>
          <label htmlFor="grid-size">Select Grid Size: </label>
          <select id="grid-size" value={gridSizeRef} onChange={handleGridSizeChange}>
            {[5, 6, 7, 8, 9, 10].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}
      
           <>
           {isConnected && (
             <div className="grid-container">
               {gridInfoRef.current.map((row, rowIndex) => (
                 <div key={rowIndex} className="grid-row">
                   {row.map((cell, colIndex) => (
                     <div
                       key={colIndex}
                       className={`grid-cell ${cell.struck ? 'struck' : ''}`}
                       onClick={() => handleCellClick(rowIndex, colIndex)}
                     >
                       {cell.number}
                     </div>
                   ))}
                 </div>
               ))}
             </div>
           )}
           {isConnected && <WordWithStrikes word={word} linesCount={linesCount} />}
           {gameEnded && won===true && <><h2>You Win!</h2><br/><button onClick={resetAndSendSignal}>Reset</button></>}
           {gameEnded && won===false && <><h2>You Lose</h2><br/><button onClick={resetAndSendSignal}>Reset</button></>}
           {isGridFull && !allReady && !selfReady && <ReadySignal readySignal={readySignal} />}
           {!selfReady && isConnected && <button onClick={randomFill}>Random Fill</button>}
           {!allReady && selfReady && isConnected && <p>Waiting for other players....</p>}
           {allReady && !gameEnded && <h4>Game Started!</h4>}
           {allReady && !gameEnded && (yourTurn===true ? <p>It's your turn</p> : <p>It's opponent's turn</p>)}
         </>
      
      <br />
      {isConnected ? (
        <>
        <button onClick={leaveGame}>Leave Game</button>
        </>
      ) : (
        <div>
          <button onClick={setupGame}>Setup a Game</button>
          <button onClick={joinGame}>Join a Game</button>
        </div>
      )}
      <GameInfo
        isOrganiser={isOrganiser}
        isConnected={isConnected}
        userKey={userKey}
        secondKey={secondKey}
        setSecondKey={setSecondKey}
        handleSubmit={handleSubmit}
      />
    
    </div>
  );
}

export default App;