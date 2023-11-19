import React, { useState, useEffect } from 'react';
import { database } from './firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("useEffect called"); // Log when useEffect is called
    const dataRef = ref(database, '1p4rz_7ShnWM-EuNAqSs3k9aYCDFmGbh6giqAP6PpQIc/Sheet1');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const fetchedData = snapshot.val();
      console.log("Fetched data:", fetchedData); // Log the fetched data
      setData(fetchedData);
    }, (error) => {
      console.error("Firebase error:", error); // Log any errors
    });
  
    return () => unsubscribe();
  }, []);
  

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Data from Realtime Database</h1>
      {data && Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {JSON.stringify(value)}
        </div>
      ))}
    </div>
  );
  
}

export default App;
