import './App.css';

import Map from './Map';

const data = {
  branches: {
    brancha: {
      name: "Lane A",
      seq: "-,/,a,b,c,d,e,f,\\,-,-",
      colour: "#f3a9bb"
    },
    branchb: {
      name: "Lane B",
      seq: "start,-,-,-,-,-,-,-,-,-,-,-,g,h,i,end,$",
      colour: "#ffd300"
    },
    branchc: {
      name: "Lane C",
      seq: "-,\\,j,k,l,m,n,o,p,q,/",
      colour: "#9b0056"
    }
  },
  milestones: {
    start: {
      name: "Start",
      colour: "red"
    },
    a: {
      name: "Task A"
    },
    b: {
      name: "Task B"
    },
    c: {
      name: "Task C"
    },
    d: {
      name: "Task D"
    },
    e: {
      name: "Task E"
    },
    f: {
      name: "Task F"
    },
    g: {
      name: "Task G"
    },
    h: {
      name: "Task H"
    },
    i: {
      name: "Task I"
    },
    end: {
      name: "End"
    },
    j: {
      name: "Task J"
    },
    k: {
      name: "Task K"
    },
    l: {
      name: "Task L"
    },
    m: {
      name: "Task M"
    },
    n: {
      name: "Task N"
    },
    o: {
      name: "Task O"
    },
    p: {
      name: "Task P"
    },
    q: {
      name: "Task Q"
    },
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
        debug={false}
        data={data}
      />
    </div>
  );
}

export default App;
