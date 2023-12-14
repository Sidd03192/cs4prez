import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';

import Snackbar from '@mui/material/Snackbar';


const AddLevelForm = (props) => {
  const [levelName, setLevelName] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [existingLevels, setExistingLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [questionName, setQuestionName] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);


  useEffect(() => {
    // Fetch existing levels for the dropdown
    const fetchLevels = async () => {
      try {
        const levelsQuery = query(collection(db, 'levels'));
        const levelsSnapshot = await getDocs(levelsQuery);
        const levelsData = levelsSnapshot.docs.map((levelDoc) => levelDoc.id);
        setExistingLevels(levelsData);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };

    fetchLevels();
  }, []);

  const handleAddLevel = async () => {
    try {
      // Add a new level to the levels collection
      const levelDocRef = doc(db, 'levels', levelName);
      await setDoc(levelDocRef, { levelName });

      // Create a subcollection "questions" under the new level document
      const questionsCollectionRef = collection(levelDocRef, 'questions');
      await addDoc(questionsCollectionRef, { name: 'question1' });

      // Initialize user progress for the new level
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const updatePromises = [];

      usersSnapshot.forEach((userDoc) => {
        const email = userDoc.data().email;
        const userUid = userDoc.id;
        updatePromises.push(
          initializeUserProgress(userUid, email, levelName)
        );
      });

      // Update user progress for the new level
      await Promise.all(updatePromises);

      console.log('Level added successfully!');
      setLevelName('');
      setSuccessOpen(true);
    } catch (error) {
      console.error('Error adding level:', error);
      setWarningOpen(true);
    }
  };

  const initializeUserProgress = async (uid, email, levelName) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userProgressRef = doc(userDocRef, 'progress', levelName);

      // Initialize with correct: 0, total: 10 for the new level
      await setDoc(
        userProgressRef,
        { [levelName]: { correct: 0, total: 10 } },
        { merge: true }
      );
    } catch (error) {
      console.error('Error initializing user progress:', error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      // Ensure a level is selected
      if (!selectedLevel) {
        console.error('Please select an existing level.');
        return;
      }

      // Add a new question to the level's subcollection
      const questionData = {
        question: question,
        answer: answer,
      };

      // Use the question name as the document name
      const questionDocRef = doc(db, 'levels', selectedLevel, 'questions', questionName);

      await setDoc(questionDocRef, questionData);

      // Fetch the current user's progress
      const userDoc = await getDoc(doc(db, 'users', 'uid1')); // Replace 'uid1' with the actual user ID
      const userProgress = userDoc.data().progress || {};

      // Get the current progress for the specified level
      const levelProgress = userProgress[selectedLevel] || { correct: 0, total: 0 };

      // Update user progress for the specified level
      await setDoc(doc(db, 'users', 'uid1'), {
        progress: {
          ...userProgress,
          [selectedLevel]: { ...levelProgress, total: levelProgress.total + 1 },
        },
      }, { merge: true });

      console.log('Question added successfully!');
      alert('Question added successfully!');
      setAnswer(""); setQuestion(""); setSelectedLevel("");
      
    } catch (error) {
      console.error('Error adding question:', error);
    
      setWarningOpen(true);
    }
  };

  return (
    <div className="add-level-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h1 style={{ width: "100%", fontSize: "20px", fontStyle: "bold", marginBottom: "5px" }}>Add New Level</h1>
      <TextField
        label="Level Name"
        variant="outlined"
        value={levelName}
        onChange={(e) => setLevelName(e.target.value)}
        style={{ marginBottom: '16px', width: '100%' }}
      />
      <Button onClick={handleAddLevel} variant="contained" color="primary" style={{ width: '100%' }}>
        Add Level
      </Button>

      <h1 style={{ width: "100%", fontSize: "20px", fontStyle: "bold", marginTop: "16px", marginBottom: '16px' }}>Add Question !</h1>
      <Autocomplete
        value={selectedLevel}
        onChange={(event, newValue) => setSelectedLevel(newValue)}
        options={existingLevels}
        sx={{ width: 250 }}
        renderInput={(params) => (
          <TextField {...params} label="Select Existing Level" variant="outlined" style={{ marginBottom: '16px', width: '100%' }} />
        )}
      />

      <TextField
        label="Question Name"
        variant="outlined"
        value={questionName} onChange={(e) => setQuestionName(e.target.value)}
        style={{ marginBottom: '16px', width: '100%' }}
      />
      <TextField
        label="Question"
        variant="outlined"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ marginBottom: '16px', width: '100%' }}
      />
      <TextField
        label="Answer"
        variant="outlined"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{ marginBottom: '16px', width: '100%' }}
      />
      <Button onClick={handleAddQuestion} variant="contained" color="primary" style={{ width: '100%' }}>
        Add Question
      </Button>

      {/* Success Snackbar */}
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={() => setSuccessOpen(false)}>
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          Operation successful!
        </Alert>
      </Snackbar>

      {/* Warning Snackbar */}
      <Snackbar open={warningOpen} autoHideDuration={6000} onClose={() => setWarningOpen(false)}>
        <Alert onClose={() => setWarningOpen(false)} severity="warning" sx={{ width: '100%' }}>
          Operation failed. Please try again.
        </Alert>
      </Snackbar>
    </div>
    
  );
};

export default AddLevelForm;
