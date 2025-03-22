import { useRef, useEffect } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { showToast } from '../Helper';
interface PeerConnectionProviderProps {
  setOrganiser:()=>void;
  HandleConnections: (peerId: string) => void;
  handleGameData: (data: any) => void;
  SendGameSetupData: () => void;
  gameReset: () => void;
  userKey:string;
}
export const usePeerConnection = ({
  setOrganiser,
  handleGameData,
  HandleConnections,
  SendGameSetupData,
  gameReset,
  userKey,
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

      conn.on("error", () => {
        console.error("Connection error with peer:", conn.peer);
        handleConnectionError();
      });

      conn.on("close", () => {
        console.log("Connection closed with peer:", conn.peer);
        handleConnectionClose();
      });
    }else{
      console.log("Connection already established with peer:", conn.peer);
    }
  });
}, []);

function handleSubmit(secondKey: string) {

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

      conn.on("error", () => {
        console.error("Connection error with second key:", secondKey);
        handleConnectionError();
      });

      conn.on("close", () => {
        console.log("Connection closed with second key:", secondKey);
        handleConnectionClose();
      });
    } else {
      console.log("Connection already established with second key:", secondKey);
    }
  } else {
    console.error("Peer not setup");
    showToast("Peer not setup");
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
function cleanPeer(){
  connRef.current = null;
  connRefPlayer2.current = null;
}
function handleConnectionError(){
  showToast("Connection Failed");
  gameReset();
  cleanPeer();
};
const handleConnectionClose = () => {
  gameReset();
  cleanPeer();
};
  function ResetPeerConnection(){
    connRef.current?.close();
    connRefPlayer2.current?.close();
    showToast("Disconnected from the Game");
    handleConnectionClose();
  }
  return {
    handleSubmit, connRef, connRefPlayer2 ,ResetPeerConnection,sendToPeer
  }
 };
