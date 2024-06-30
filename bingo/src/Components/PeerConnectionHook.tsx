import React, { useRef, useEffect } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { GameData } from '../DataTypes';
interface PeerConnectionProviderProps {
  HandleConnections: (peerId: string) => void;
  handleGameData: (data: any) => void;
  SendGameSetupData: () => void;
  leaveAndReset: () => void;
  userKey:string;
}
export const usePeerConnection = ({
  handleGameData,
  HandleConnections,
  SendGameSetupData,
  leaveAndReset,
  userKey
}: PeerConnectionProviderProps) => {
  const peerRef= useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const connRefPlayer2 = useRef<DataConnection | null>(null);
  useEffect(() => {
    if (peerRef.current === null) {
      const peer = new Peer(userKey);
      peerRef.current = peer;
      console.log("Peer setup");
    }
    peerRef.current?.on("connection", (conn) => {
      if (connRefPlayer2.current === null) {
        connRefPlayer2.current = conn;
        HandleConnections(conn.peer);
      }
      conn.on("data", (data) => {
        let c=data as GameData;
        console.log("Connection data"+c.id+c.content);
        handleGameData(data);
      });
      conn.on("open", () => {
        console.log("Connection opened");
      });
      conn.on("error", handleConnectionError);
      conn.on("close", handleConnectionClose);
    });
}, []);

function handleSubmit(event: React.FormEvent<HTMLFormElement>, secondKey: string) {
  event.preventDefault();
  if (peerRef.current !== null) {
    if (connRef.current === null) {
      const conn = peerRef.current.connect(secondKey);
      connRef.current = conn;
      HandleConnections(secondKey);
    }
    connRef.current.on("open", () => {
      console.log("Connection opened");
      SendGameSetupData();
    });
    connRef.current.on("data", (data) => {
      let c=data as GameData;
      console.log("Connection data"+c.id+c.content);
      handleGameData(data);
    });
    connRef.current.on("error", handleConnectionError);
    connRef.current.on("close", handleConnectionClose);
  }
}
function sendToPeer(data: any) {
  if (connRef.current) {
    connRef.current.send(data);
  } else {
    console.error('Connection not established.');
  }
}


function handleConnectionError(error: any){
  console.error("Connection error:", error);
  leaveAndReset();
};
const handleConnectionClose = () => {
  leaveAndReset();
};
  function ResetPeerConnection(){
    connRef.current?.close();
    connRefPlayer2.current?.close();
    connRef.current = null;
    connRefPlayer2.current = null;
  }
  return {
    handleSubmit, connRef, connRefPlayer2 ,ResetPeerConnection,sendToPeer
  }
 };
