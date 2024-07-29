import React, { useRef, useEffect } from 'react';
import Peer, { DataConnection } from 'peerjs';
interface PeerConnectionProviderProps {
  setOrganiser:()=>void;
  HandleConnections: (peerId: string) => void;
  handleGameData: (data: any) => void;
  SendGameSetupData: () => void;
  gameReset: () => void;
  userKey:string;
  showToast:(message:string)=>void;
}
export const usePeerConnection = ({
  setOrganiser,
  handleGameData,
  HandleConnections,
  SendGameSetupData,
  gameReset,
  userKey,
  showToast
}: PeerConnectionProviderProps) => {
  const peerRef = useRef<Peer | null>(null);
const connRef = useRef<DataConnection | null>(null);
const connRefPlayer2 = useRef<DataConnection | null>(null);

useEffect(() => {
  if (peerRef.current === null) {
    const peer = new Peer(userKey);
    peerRef.current = peer;
    console.log("Peer setup");
  }

  peerRef.current?.on("connection", (conn) => {
    console.log("Incoming connection from peer:", conn.peer);

    if (connRefPlayer2.current === null) {
      connRefPlayer2.current = conn;
      HandleConnections(conn.peer);

      conn.on("data", (data) => {
        console.log("Data received from peer:", conn.peer, data);
        handleGameData(data);
      });

      conn.on("open", () => {
        console.log("Connection opened with peer:", conn.peer);
      });

      conn.on("error", (err) => {
        console.error("Connection error with peer:", conn.peer, err);
        handleConnectionError(err);
      });

      conn.on("close", () => {
        console.log("Connection closed with peer:", conn.peer);
        handleConnectionClose();
      });
    }
  });
}, []);

function handleSubmit(event: React.FormEvent<HTMLFormElement>, secondKey: string) {
  event.preventDefault();

  if (secondKey === userKey) {
    showToast("Please put someone else's key!");
    return;
  }

  if (peerRef.current !== null) {
    if (connRef.current === null) {
      setOrganiser();
      const conn = peerRef.current.connect(secondKey);
      connRef.current = conn;
      HandleConnections(secondKey);

      conn.on("open", () => {
        console.log("Connection opened with second key:", secondKey);
        SendGameSetupData();
      });

      conn.on("data", (data) => {
        console.log("Data received from second key:", secondKey, data);
        handleGameData(data);
      });

      conn.on("error", (err) => {
        console.error("Connection error with second key:", secondKey, err);
        handleConnectionError(err);
      });

      conn.on("close", () => {
        console.log("Connection closed with second key:", secondKey);
        handleConnectionClose();
      });
    } else {
      console.log("Connection already established with second key:", secondKey);
    }
  }
}

function sendToPeer(data: any) {
  if (connRef.current) {
    connRef.current.send(data);
  } else {
    showToast("Connection not established.");
    console.error('Connection not established.');
  }
}


function handleConnectionError(error: any){
  console.error("Connection error:", error);
  showToast("Connection Failed");
  gameReset();
};
const handleConnectionClose = () => {
  gameReset();
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
