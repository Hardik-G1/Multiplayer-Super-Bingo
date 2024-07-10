import { useEffect, useState,  } from 'react';
import {  GameData } from '../DataTypes';


export const useGameConnnection = (isOrganiser:boolean,userKey:string,SendRequest:(requestData:GameData)=>void,SendRequestToOther:(requestData:GameData)=>void,startTimer:()=>void) => {
    const [connections, setConnections] = useState([{ id: userKey, ready: false }]);
    const [isConnected, setIsConnected] = useState(false);
    const [allReady, setAllReady] = useState(false);
    const [selfReady, setSelfReady] = useState(false);
    const [yourTurn, setYourTurn] = useState<boolean|null>(null);
    useEffect(() => {
      console.log("sad");
        checkAllReady();
      }, [connections]);
      
      function HandlePlayersReady(id:string){
        setConnections(prevState => prevState.map(item =>
          item.id === id ? { ...item, ready: true } : item
        ));
      }
      function checkAllReady(){
        if (connections.every(s => s.ready)) {
          setAllReady(true);
          if (isOrganiser){
            toss();
          }
        }
      }
      function readySignal(){
        HandlePlayersReady(userKey);
        setSelfReady(true);
        SendRequest({ id: "rs", content: { id: userKey }})
      }
      function toss(){
        const rndNum = Math.random();
        let isYourTurn=rndNum >= 0.5;
        console.log(rndNum);
        setYourTurn(isYourTurn);
        SendRequestToOther({ id: "tn", content: isYourTurn })
        if(isYourTurn){
          startTimer();
        }
        // connRef.current?.send({ id: "tn", content: rndNum >= 0.5 });
      }
      function ResetPlayerConnectionStatus(){
        setAllReady(false);
        setSelfReady(false);
        setConnections(prevState => prevState.map(item =>{
            return { ...item, ready:false};
          }));
      }
      function DisconnectedFromPlayer(){
        setIsConnected(false);
      }
  return {
    setConnections,
    readySignal,
    HandlePlayersReady,
    isConnected,
    setIsConnected,
    allReady,
    selfReady,
    yourTurn,
    setYourTurn,
    DisconnectedFromPlayer,
    ResetPlayerConnectionStatus
  };
};
