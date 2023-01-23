import { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('some-url');
      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, []);

  return <div>{data.map(d => <p key={d.id}>{d.name}</p>)}</div>;
}
