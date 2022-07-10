import * as bigintCryptoUtils from 'bigint-crypto-utils';
import { useEffect, useState } from 'react';
import './App.css';


function App() {
  const [on, setOn] = useState(false);
  const [checked, setChecked] = useState<bigint[]>([]);
  const [intervalState, setIntervalState] = useState<NodeJS.Timer>()
  const [size, setSize] = useState(4096);
  const postPrime = (prime: bigint) => {
    fetch(`https://vol-be.azurewebsites.net/primes/${prime.toString()}`, {
      method: 'POST',
    })
  }

  const addPrime = async () => {
    const number = await bigintCryptoUtils.prime(size);
    postPrime(number);
    setChecked((checked) => [...checked, number]);
  }

  useEffect(() => {
    if (on) {
      setIntervalState(setInterval(addPrime, 1000));
    } else {
      clearInterval(intervalState);
    }
  }, [on])

  return (
    <div className="App">
      <input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} />
      <button onClick={() => setOn((state) => !state)}>{on ? 'Stop' : 'Start'}</button>
      {checked?.map((x, i) => <div key={i}>{x.toString()}</div>)}
    </div>
  );
}

export default App;
