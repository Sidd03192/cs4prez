import React from 'react';
import { Container, Typography, Paper, Button, Box, Grid, Card, CardContent } from '@mui/material';
import AppImage from './Learning.jpg'; // Replace with your app image

export const About = () => {
  return (
    <Container maxWidth="100%" maxHeight="100%" sx={{ marginTop: '2rem' }}>
      <Paper
        
        elevation={3}
        sx={{
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Our Learning App!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <img src={AppImage} alt="App Preview" style={{ width: '100%', borderRadius: '8px' }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography paragraph>
              Our app is designed to revolutionize the way you learn and enhance your educational journey.
              Here are some key features that make our app unique:
            </Typography>
            <Card sx={{ marginBottom: '1rem' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Practice Mode
                </Typography>
                <Typography>
                  Sharpen your skills through our interactive practice mode. Access a vast library of questions
                  and receive instant feedback to track your progress.
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ marginBottom: '1rem' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personalized Scheduler
                </Typography>
                <Typography>
                  Plan your study sessions effectively with our personalized scheduler. Set goals, create a
                  study plan, and receive reminders to stay on track.
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Collaborative Tools
                </Typography>
                <Typography>
                  Foster collaboration by connecting with peers. Share study materials, join discussion forums,
                  and engage in group projects for a more enriching learning experience.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Typography paragraph sx={{ marginTop: '1.5rem' }}>
          At Our Learning App, we believe in making education accessible, engaging, and collaborative. Join us
          on this learning journey and unlock your full potential.
        </Typography>
        <Box mt={3}>
          <Button variant="contained" color="primary" href="/contact">
            Contact Us
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

//export default AboutPage;
