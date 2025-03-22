import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "../Components/Layout";
// import Game from "./Game";
import MainMenu from './MainMenu';

function LandingPage() {
  return <Layout
    title={"Super Bingo"}
    footer={"© 2025 Super Bingo. All rights reserved."}
  >
    <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={3}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
    />
    <MainMenu />
  </Layout>;
}

export default LandingPage;