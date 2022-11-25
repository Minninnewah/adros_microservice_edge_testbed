import logo from './logo.svg';
import './App.css';
import SpeedAnalysis from './speed_analysis';
import CarDistribution from './car_distribution';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Front-end</h2>
      </header>
      <SpeedAnalysis/>
      <CarDistribution/>
    </div>
  );
}

export default App;
