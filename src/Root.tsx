import GameArea from './Components/GameArea';
import './Root.css';
import Layout from "./Components/Layout"
function Root() {
  return (
    <div className="App">
      <Layout
      title={"Super Bingo"}
      footer={"© 2025 Super Bingo. All rights reserved."}
    >
        <GameArea/>
      </Layout>
    </div>
  );
}

export default Root;
