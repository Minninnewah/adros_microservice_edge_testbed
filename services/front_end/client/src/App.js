import logo from './logo.svg';
import './App.css';
import SpeedAnalysis from './speed_analysis';
import DroneDistribution from './drone_distribution';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Front-end</h2>
      </header>
      <SpeedAnalysis/>
      <DroneDistribution/>
    </div>
  );
}

export default App;
