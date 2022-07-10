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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on])

  return (
    <div className="App">
      <h1>Let's find primes together! v0.1</h1>
      <h3>You have found {checked.length} primes!</h3>
      Searching for <input style={{ width: "45px" }} type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} /> Bit primes
      <br></br>
      <br></br>
      <button onClick={() => setOn((state) => !state)}>{on ? 'Stop' : 'Start'}</button>
      {checked?.map((x, i) => <div key={i}>{x.toString()}</div>)}
    </div>
  );
}

export default App;
