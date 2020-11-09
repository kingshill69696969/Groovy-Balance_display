import DisplayBalance from './components/DisplayBalance/DisplayBalance';
import Web3Provider from './contexts/Web3Provider/Web3Provider';

function App() {
  return (
    <Web3Provider>
      <DisplayBalance />
    </Web3Provider>
  );
}

export default App;
