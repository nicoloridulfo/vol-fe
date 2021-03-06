import * as bigintCryptoUtils from 'bigint-crypto-utils';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import './App.css';

interface IStats {
  count: number;
  submitters: {
    ip: number;
    count: number;
  }[]
}
const fetcher = (url: URL) => fetch(url).then(res => res.json())


function App() {
  const [on, setOn] = useState(false);
  const [primes, setPrimes] = useState<bigint[]>([]);
  const [running, setRunning] = useState(false);
  const [size, setSize] = useState(4096);
  const { data: stats } = useSWR<IStats>('https://vol-be.azurewebsites.net/primes/stats', fetcher, { refreshInterval: 5000 });



  const findPrime = async () => {
    const number = await bigintCryptoUtils.prime(size);
    fetch(`https://vol-be.azurewebsites.net/primes/${number.toString()}`, {
      method: 'POST',
    })
    setPrimes((checked) => [...checked, number]);
    setRunning(false);
  }

  useEffect(() => {
    if (on && !running) {
      setRunning(true);
      setTimeout(findPrime, 1000);
    }
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [on, running]);


  return (
    <div className="App">
      <h1>Let's find primes together! v0.1</h1>
      <h3>Together we have found {stats?.count} primes!</h3>
      <h3>You have found {primes.length} primes during this session.</h3>
      <hr></hr>
      <h2>Leaderboard</h2>
      <h5> (hashcode of ip - primes found)</h5>
      {stats?.submitters.map(({ ip, count }) => <div key={ip}>{ip} - {count}</div>)}
      <hr></hr>
      Searching for <input style={{ width: "45px" }} type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} /> Bit primes
      <br></br>
      <br></br>
      <button onClick={() => setOn((state) => !state)}>{on ? 'Stop' : 'Start'}</button>
      {primes?.map((x, i) => <div key={i}>{x.toString()}</div>)}
    </div>
  );
}

export default App;
