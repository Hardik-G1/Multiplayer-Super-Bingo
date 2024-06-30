// import { useTimer } from 'react-timer-hook';

// function Timer({ expiryTimestamp,autoStart }) {
//   const {
//     seconds,
//     minutes,
//     start,
//     pause,
//     resume,
//   } = useTimer({ expiryTimestamp, autoStart,onExpire: () => console.warn('onExpire called') });

//   function onStart(){
//     start();
// }
//   return (
    
//     <div style={{textAlign: 'center'}}>
//       <div style={{fontSize: '25px'}}>
//        <span>{minutes}</span>:<span>{seconds}</span>
//       </div>
//       <button onClick={onStart}>Start</button>
//       <button onClick={pause}>Pause</button>
//       <button onClick={resume}>Resume</button>
//     </div>
//   );
// }
// export default Timer;