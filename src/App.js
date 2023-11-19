import React, { useState, useEffect } from 'react';
import { database } from './firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Container, Grid, Card, CardContent, Typography, TextField, Chip, Modal, Box } from '@mui/material';

function App() {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegrees, setSelectedDegrees] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedGradYears, setSelectedGradYears] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState(null);
  

  useEffect(() => {
    const dataRef = ref(database, '1p4rz_7ShnWM-EuNAqSs3k9aYCDFmGbh6giqAP6PpQIc/Sheet1');
    onValue(dataRef, (snapshot) => {
      setData(snapshot.val());
    });
  }, []);

  function filterData(data) {
    return Object.entries(data).filter(([key, value]) => {
      const matchesSearchQuery = !searchQuery || Object.values(value).some(item =>
        item.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesDegree = !selectedDegrees.length || selectedDegrees.includes(value.Degree);
      const matchesJobType = !selectedJobTypes.length || selectedJobTypes.includes(value['Job type']);
      const matchesGradYear = !selectedGradYears.length || selectedGradYears.includes(value['Gradaution Date']);
      return matchesSearchQuery && matchesDegree && matchesJobType && matchesGradYear;
    });
  }

  function handleFilterChange(filterType, item) {
    if (filterType === 'degree') {
      setSelectedDegrees(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    } else if (filterType === 'jobType') {
      setSelectedJobTypes(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    } else if (filterType === 'gradYear') {
      setSelectedGradYears(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    }
  }

  function renderCheckboxes(filterType, items) {
    const isSelected = (item) => {
      if (filterType === 'degree') return selectedDegrees.includes(item);
      if (filterType === 'jobType') return selectedJobTypes.includes(item);
      if (filterType === 'gradYear') return selectedGradYears.includes(item);
      return false;
    };

    return items.map(item => (
      <div key={item}>
        <input
          type="checkbox"
          checked={isSelected(item)}
          onChange={() => handleFilterChange(filterType, item)}
        />
        {item}
      </div>
    ));
  }

  function renderFilterSidebar() {
    return (
      <div style={{ padding: '20px', borderRight: '1px solid #ccc' }}>
        <h2>Filter by Degree</h2>
        {renderCheckboxes('degree', ['IC', 'PSYC', 'LMC'])}
        <h2>Filter by Job Type</h2>
        {renderCheckboxes('jobType', ['Internship', 'Full time job', 'Networking'])}
        <h2>Filter by Graduation Year</h2>
        {renderCheckboxes('gradYear', [2024, 2025])}
      </div>
    );
  }
  


  function openModal(filterType) {
    setActiveFilterType(filterType);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setActiveFilterType(null);
  }

  function renderFilterTags() {
    return (
      <div style={{ display: 'flex', overflowX: 'auto', padding: '10px' }}>
        <Chip label="Filter by Degree" onClick={() => openModal('degree')} style={{ marginRight: '10px' }} />
        <Chip label="Filter by Job Type" onClick={() => openModal('jobType')} style={{ marginRight: '10px' }} />
        <Chip label="Filter by Graduation Year" onClick={() => openModal('gradYear')} />
      </div>
    );
  }

  function renderModalContent() {
    switch (activeFilterType) {
      case 'degree':
        return renderCheckboxes('degree', ['IC', 'PSYC', 'LMC']);
      case 'jobType':
        return renderCheckboxes('jobType', ['Internship', 'Full time job', 'Networking']);
      case 'gradYear':
        return renderCheckboxes('gradYear', [2024, 2025]);
      default:
        return null;
    }
  }

  if (!data) return <div>Loading...</div>;

  return (
    <div className="App">
    <Container style={{ marginTop: '20px', maxWidth: '1000px' }}>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <div className="responsive-filter-container">
        {renderFilterTags()}
      </div>
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', maxHeight: '80vh', overflow: 'auto' }}>
          {renderModalContent()}
        </Box>
      </Modal>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} className="desktop-filter-sidebar">
          {renderFilterSidebar()}
        </Grid>
        <Grid item xs={12} md={8}>
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
        </Grid>
      </Grid>
    </Container>
    </div>
  );
  
  
}

export default App;
