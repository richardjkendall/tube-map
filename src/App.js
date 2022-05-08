import './App.css';

import Map from './Map';

const data = {
  branches: {
    brancha: {
      seq: "-,/,2,3,4,\\",
      colour: "red"
    },
    branchb: {
      seq: "1,-,-,-,-,-,7",
      colour: "black"
    },
    branchc: {
      seq: "-,\\,5,6,-,/",
      colour: "blue"
    }
  },
  milestones: {
    1: {
      id: 1,
      name: "Task A"
    },
    2: {
      id: 2,
      name: "Task B"
    },
    3: {
      id: 3,
      name: "Task C",
    },
    4: {
      id: 4,
      name: "Task D"
    },
    5: {
      id: 5,
      name: "Task E"
    },
    6: {
      id: 6,
      name: "Task F"
    },
    7: {
      id: 7,
      name: "Task G"
    },
    8: {
      id: 8,
      name: "Task H"
    },
    9: {
      id: 9,
      name: "Task I"
    }
  }
}

function App() {
  return (
    <div className="App">
      <Map
        dimensions={{
          width: 1000, height: 400,
          margin: { top: 0, right: 30, bottom: 30, left: 0 }
        }}
        data={data}
      />
    </div>
  );
}

export default App;
