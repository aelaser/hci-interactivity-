import React, { useState, useEffect } from 'react';
import { database } from './firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Container, Grid, Card, CardContent, Typography, TextField } from '@mui/material';

function App() {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const dataRef = ref(database, '1p4rz_7ShnWM-EuNAqSs3k9aYCDFmGbh6giqAP6PpQIc/Sheet1');
    onValue(dataRef, (snapshot) => {
      setData(snapshot.val());
    });
  }, []);

  function filterData(data) {
    if (!searchQuery) return Object.entries(data);
    return Object.entries(data).filter(([key, value]) => {
      return Object.values(value).some(item =>
        item.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  if (!data) return <div>Loading...</div>;

  return (
    <Container maxWidth="md" style={{ marginTop: '100px' }}>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <h1>Student Info</h1>
      <Grid container spacing={3}>
        {filterData(data).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {value.Name}
                </Typography>
                <Typography color="textSecondary">
                  Degree: {value.Degree}
                </Typography>
                <Typography color="textSecondary">
                  Graduation Date: {value['Gradaution Date']}
                </Typography>
                <Typography color="textSecondary">
                  Job Type: {value['Job type']}
                </Typography>
                <Typography color="textSecondary">
                  ID: {value.Id}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;
