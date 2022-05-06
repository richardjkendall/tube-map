import './App.css';

import Map from './Map';

function App() {
  return (
    <div className="App">
      <Map
        dimensions={{
          width: 700, height: 500,
          margin: { top: 0, right: 30, bottom: 30, left: 0 }
        }}
        data="blah"
      />
    </div>
  );
}

export default App;
