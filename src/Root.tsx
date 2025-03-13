import Footer from './Components/Footer';
import GameArea from './Components/GameArea';
import Header from './Components/Header';
import './Root.css';
function Root() {
  return (
    <div className="App">
      <Header/>
      <div className="App-body">
        <GameArea/>
      </div>
        <Footer/>
    </div>
  );
}

export default Root;
