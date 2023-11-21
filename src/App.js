import React, { useState, useEffect } from 'react';
import { database } from './firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Container, Grid, Card, CardContent, Typography, TextField, Chip, Modal, Box } from '@mui/material';
import { createMuiTheme, ThemeProvider } from '@mui/material/styles';
import CustomArrowIcon from './components/ArrowIcon'; // Adjust the import path as needed
import { Divider, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';


const theme = createMuiTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 16, // Base font size in pixels
    h1: {
      fontSize: '1rem', // Corresponds to 32px
    },
    h2: {
      color: '#00233F',
      marginTop: '1rem',
      marginBottom: '0.5rem',
      fontWeight: '600',
      fontSize: '1.2rem', // Corresponds to 32px
    },
    h3: {
      color: 'rgba(0, 35, 63, 100%)',
      fontSize: '1rem',
      fontWeight: 540,
      marginTop: '0.9rem',
      marginBottom: '0.4rem',
    },
    body1: {
      fontSize: '1rem', // Corresponds to 16px
    },

  },
});

function App() {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegrees, setSelectedDegrees] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedGradYears, setSelectedGradYears] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState(null);


  // New state for storing unique filter options
  const [uniqueDegrees, setUniqueDegrees] = useState([]);
  const [uniqueJobTypes, setUniqueJobTypes] = useState([]);
  const [uniqueGradYears, setUniqueGradYears] = useState([]);
  const [uniqueInterests, setUniqueInterests] = useState([]); // New state for interests

  const [expanded, setExpanded] = useState({}); // State to manage expanded cards

  const handleExpandClick = (id) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [id]: !prevExpanded[id] // Toggle the expanded state for the specific card
    }));
  };


  useEffect(() => {
    const dataRef = ref(database, '1p4rz_7ShnWM-EuNAqSs3k9aYCDFmGbh6giqAP6PpQIc/Sheet1');
    onValue(dataRef, (snapshot) => {
      const fetchedData = snapshot.val();
      setData(fetchedData);

      // Extract unique values for each filter category
      const degrees = new Set();
      const jobTypes = new Set();
      const gradYears = new Set();
      const interests = new Set();
      Object.values(fetchedData).forEach(item => {
        degrees.add(item.Degree);
        jobTypes.add(item['Job type']);
        gradYears.add(item['Graduation Date']);
        if(item.Interests) {
          interests.add(item.Interests);
        }
      });

      setUniqueDegrees([...degrees]);
      setUniqueJobTypes([...jobTypes]);
      setUniqueGradYears([...gradYears]);
      setUniqueInterests([...interests]);
    });
  }, []);

   

  function filterData(data) {
    return Object.entries(data).filter(([key, value]) => {
      const matchesSearchQuery = !searchQuery || Object.values(value).some(item =>
        item.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesDegree = !selectedDegrees.length || selectedDegrees.includes(value.Degree);
      const matchesJobType = !selectedJobTypes.length || selectedJobTypes.includes(value['Job type']);
      const matchesGradYear = !selectedGradYears.length || selectedGradYears.includes(value['Graduation Date']);
      const matchesInterests = !selectedInterests.length || selectedInterests.includes(value.Interests);
    return matchesSearchQuery && matchesDegree && matchesJobType && matchesGradYear && matchesInterests;
    });
  }

  function handleFilterChange(filterType, item) {
    if (filterType === 'degree') {
      setSelectedDegrees(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    } else if (filterType === 'jobType') {
      setSelectedJobTypes(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    } else if (filterType === 'gradYear') {
      setSelectedGradYears(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    } else if (filterType === 'interests') {
      setSelectedInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    }
    
  }

  // Check if an item is selected for a specific filter type
  const isSelected = (filterType, item) => {
    switch (filterType) {
      case 'degree':
        return selectedDegrees.includes(item);
      case 'jobType':
        return selectedJobTypes.includes(item);
      case 'gradYear':
        return selectedGradYears.includes(item);
      case 'interests':
        return selectedInterests.includes(item);
      default:
        return false;
    }
  };  
  function renderCheckboxes(filterType) {
    let items;
    if (filterType === 'degree') {
      items = uniqueDegrees;
    } else if (filterType === 'jobType') {
      items = uniqueJobTypes;
    } else if (filterType === 'gradYear') {
      items = uniqueGradYears;
    } else if (filterType === 'interests') {
      items = uniqueInterests;
    }
  
    return items.map(item => (
      <div className="checkbox-container" key={item}>
        <input
          type="checkbox"
          checked={isSelected(filterType, item)}
          onChange={() => handleFilterChange(filterType, item)}
        />
        <label>{item}</label>
      </div>
    ));
  }
  
  

  function renderFilterSidebar() {
    return (
      <div className = "filter-card" style={{ padding: '20px', borderRight: '1px solid #ccc' }}>
        {/* Filter by degree */}
        <h2>Track</h2>
        {renderCheckboxes('degree', ['IC', 'PSYC', 'LMC'])}
        {/* Filter by grad year */}
        <h2 style = {{marginTop: '28px'}}>Class Year</h2>
        {renderCheckboxes('gradYear', [2024, 2025])}
        {/* Filter by interests */}
        <h2 style={{ marginTop: '28px' }}>Interests</h2>
        {renderCheckboxes('interests')}
        {/* Filter by job type */}
        <h2 style = {{marginTop: '28px'}}>Seeking</h2>
        {renderCheckboxes('jobType', ['Internship', 'Full time', 'Networking'])}
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
        {/* Filters */}
        <Chip label="Degree" onClick={() => openModal('degree')} style={{ marginRight: '10px' }} />
        <Chip label="Job Type" onClick={() => openModal('jobType')} style={{ marginRight: '10px' }} />
        <Chip label="Graduation Year" onClick={() => openModal('gradYear')} />
      </div>
    );
  }

  function renderModalContent() {
    switch (activeFilterType) {
      case 'degree':
        return renderCheckboxes('degree', ['IC', 'PSYC', 'LMC']);
      case 'jobType':
        return renderCheckboxes('jobType', ['Internship', 'Full time', 'Networking']);
      case 'gradYear':
        return renderCheckboxes('gradYear', [2024, 2025]);
        case 'interests':
          return renderCheckboxes('interests');
      default:
        return null;
    }
  }

  if (!data) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
    <Container style={{ marginTop: '35px', maxWidth: '1000px' }}>
      {/* Header Image */}
      <img 
        src="https://i.postimg.cc/RFyHr2SF/Email-Header-Interactivity2024-copy-2-png.png" // Replace with your image URL
        alt="Header"
        style={{
          width: '100%', // Full width of the container
          height: 'auto', // Maintain aspect ratio
          marginBottom: '35px', // Space between image and search bar
          borderRadius: '1.5rem', // Rounded edges
        }}
      />
      
      {/* Search Bar */}
      <TextField
        className='search-bar'
        fullWidth
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '35px' }}
      />
      <div className="responsive-filter-container">
        {renderFilterTags()}
      </div>
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', maxHeight: '80vh', overflow: 'auto' }}>
          {renderModalContent()}
        </Box>
      </Modal>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3.5} className="desktop-filter-sidebar">
          {renderFilterSidebar()}
        </Grid>
        <Grid item xs={12} md={8.5}>
          <h1>Meet Our Students</h1>
          <Grid container spacing={3}>
            {filterData(data).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Card 
                  className="rounded-card" 
                  style={{ 
                    boxShadow: expanded[key] ? 'none' : '0px 6.5px 0px rgba(64, 136, 194, 0.5)', // Conditional shadow
                 
                  }} 
                  onClick={() => handleExpandClick(key)}
                >
                  <CardContent style={{textAlign: 'center'}}>
                  <div style={{ textAlign: 'left' }}>
                    <Chip
                      label={`${value.Id}`}
                      style={{
                        backgroundColor: 'rgba(255, 161, 0, 0.5)',
                        borderRadius: '20px',
                        color: '#00233F',
                        marginBottom: '10px' // Space between the Chip and the image
                      }}
                    />
                  </div>
                  {value.Image && (
                    <img
                      src={value.Image}
                      alt={value.Name}
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                        margin: 'auto',
                        marginBottom: '10px' // Space between image and text
                      }}
                    />
                  )}
                    <Typography variant="h2" component="h2">
                      {value.Name}
                    </Typography>
                    <Typography color="textSecondary">
                      {value.Degree} | {value['Graduation Date']}
                    </Typography>
                    {/* <Typography color="textSecondary">
                      Graduation Date: {value['Graduation Date']}
                    </Typography> */}
                    
                    {expanded[key] && (
                        <>
                          <Typography variant="h3" component="h3">
                            Interests:
                          </Typography>
                          <Typography color="textSecondary">
                            {value['Interests']}
                          </Typography>
                        </>
                      )}

{expanded[key] && (
  <>
    <Typography variant="h3" component="h3">
      Seeking:
    </Typography>
    <Typography color="textSecondary">
      {value['Job type']}
    </Typography>
    <Divider style={{ margin: '20px 0' }} />
    <div style={{ display: 'flex', justifyContent: 'center' }}>
    {expanded[key] && value.Linkdin && (
      <IconButton 
        aria-label="LinkedIn" 
        href={value.Linkdin} 
        target="_blank" // Open in new tab
        style={{ 
          margin: '0 5px', 
          border: '1px solid #E0E4E8',
          borderRadius: '30%', // Makes the border circular
          color: '#BCC3C9' 
        }} 
        onMouseOver={(e) => e.currentTarget.style.color = '#4088C2'}
        onMouseOut={(e) => e.currentTarget.style.color = '#BCC3C9'}
      >
      <LinkedInIcon style={{ fontSize: '20px' }}/>
      </IconButton>
      )}
      {expanded[key] && value.Portfolio && (
      <IconButton 
        aria-label="Website" 
        href={value.Portfolio}
        target="_blank"
        style={{ 
          margin: '0 5px', 
          border: '1px solid #E0E4E8',
          borderRadius: '30%', // Makes the border circular
          color: '#BCC3C9' 
        }} 
        onMouseOver={(e) => e.currentTarget.style.color = '#4088C2'}
        onMouseOut={(e) => e.currentTarget.style.color = '#BCC3C9'}
      >
        <LanguageIcon style={{ fontSize: '20px' }}/>
      </IconButton>
    )}
      {expanded[key] && value.Email && (
      <IconButton 
        aria-label="Email" 
        href={`mailto:${value.Email}`}
        style={{ 
          margin: '0 5px', 
          border: '1px solid #E0E4E8',
          borderRadius: '30%', // Makes the border circular
          color: '#BCC3C9' 
        }} 
        onMouseOver={(e) => e.currentTarget.style.color = '#4088C2'}
        onMouseOut={(e) => e.currentTarget.style.color = '#BCC3C9'}
      >
        <EmailIcon style={{ fontSize: '20px' }}/>
      </IconButton>
    )}

    </div>
  </>
)}


                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginRight: '20px', marginBottom: '5px', cursor: 'pointer'}}>
                      <div onClick={(e) => { 
                                  e.stopPropagation(); // Stop event propagation
                                  handleExpandClick(key);
                                }}>
                  <CustomArrowIcon isOpen={expanded[key]} />
                </div>
              </div>


                    

       

              
                    {/* <Typography color="textSecondary">
                      ID: {value.Id}
                    </Typography> */}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
    </div>
    </ThemeProvider>
  );
  
  
}

export default App;
