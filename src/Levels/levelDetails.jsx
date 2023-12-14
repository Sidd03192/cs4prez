// LevelDetailPage.jsx
import 'semantic-ui-css/semantic.min.css';
import ConfettiExplosion from 'react-confetti-explosion';
import TextField from '@mui/material/TextField';
import { Progress } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  getDoc, setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { Alert, Button,AlertTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Levels.css';

const LevelDetailPage = () => {
  const { levelId } = useParams();
  const [user, setUser] = useState(getAuth().currentUser);
  const [levels, setLevels] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [userProgress, setUserProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

const navigate = useNavigate();
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const levelsCollection = collection(db, 'levels');
        const levelsSnapshot = await getDocs(levelsCollection);

        const levelsData = levelsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLevels(levelsData);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };

    const fetchQuestions = async () => {
      try {
        const questionsCollection = collection(db, 'levels', levelId, 'questions');
        const questionsSnapshot = await getDocs(questionsCollection);

        const questionsData = questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    

    fetchLevels();
    fetchQuestions();
    fetchUserProgress();
  }, [levelId, user]);
  const fetchUserProgress = async () => {
    try {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const levelProgressRef = doc(userRef, 'progress', levelId);
        const levelProgressSnapshot = await getDoc(levelProgressRef);

        if (levelProgressSnapshot.exists()) {
          setUserProgress(levelProgressSnapshot.data().correct);
        } else {
          setUserProgress(0);
        }
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };
  const currentLevel = levels.find((level) => level.id === levelId);
  const currentQuestionIndex = userProgress;

  const handleAnswer = async (userAnswer) => {
    try {
      const currentQuestion = questions[currentQuestionIndex];

      const isCorrect = userAnswer === currentQuestion.answer;

      if (isCorrect) {
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const levelRef = doc(userRef, 'progress', levelId);

          const progressSnapshot = await getDoc(levelRef);
          const currentProgress = progressSnapshot.data();

          await updateDoc(levelRef, {
            correct: currentProgress.correct + 1,
          });

          // Set confetti active for 1 second
          setIsConfettiActive(true);
          setTimeout(() => {
            setIsConfettiActive(false);

            // Show the alert after confetti animation is complete
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);

              if (currentQuestionIndex + 1 < questions.length) {
                setUserProgress(userProgress + 1);
              } else {
                setUserProgress(userProgress + 1);
                setShowCompletionAlert(true);

              }
            }, 1000);
          }, 1000);
        }
      } else {
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 1000);
        console.log('Incorrect answer. Please try again.');
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const resetProgress = async () => {
    console.log("Attempting to reset progress");

    try {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const levelProgressRef = doc(userRef, 'progress', levelId);

        // Reset the user's progress for the current level to 0
        await setDoc(levelProgressRef, { correct: 0 });

        // Fetch the updated progress to ensure it's reflected immediately
        await fetchUserProgress();

        // Refresh the screen to start the user back on question 1
        window.location.reload();
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };





  return (
    <div className='all'>
     
           

      <div className='currentquestion'>
      <div className='alerts'>
      {showErrorAlert && <Alert className='Alert' variant='filled' severity="error">   <AlertTitle> Wrong Answer</AlertTitle>
Please try again.</Alert>}
            {showAlert && <Alert variant='filled'severity="success">  <AlertTitle>Correct Answer</AlertTitle>
Great Job !!</Alert>}
      </div>
      {/* Show confetti when isConfettiActive is true */}
      {isConfettiActive && <ConfettiExplosion /> }

      
      {showCompletionAlert && (
        <div>
          <Alert
            severity="success"
            action={
              <Button color="inherit" size="small" onClick={() => navigate('/learn')}>
                Levels
              </Button>
            }
          >
            Level Completed! {/* Customize the message as needed */}
          </Alert>
          <button onClick={resetProgress} className="button type1"> </button>
        </div>
      )}

      <h1 className='thislevel'>{currentLevel && `${currentLevel.id}`}</h1>
      {user && (
        <>
          <p className=''>Let's get started, {user.displayName}!</p>
          <p className='progress'>Your progress: {userProgress} / {questions.length}</p>
        </>
      )}
      {questions.length > 0 && userProgress < questions.length && (
        <div>
          <p className='thequestion'>{questions[userProgress].question}</p>
          <TextField
            className='answer'
            id='filled-basic'
            variant='filled'
            type="text"
            placeholder="Type your answer"
            value={questions[userProgress].userAnswer || ''}
            onChange={(e) => {
              const updatedQuestions = [...questions];
              updatedQuestions[userProgress] = {
                ...updatedQuestions[userProgress],
                userAnswer: e.target.value,
              };
              setQuestions(updatedQuestions);
            }}
          />
          <button className="answerbutton" onClick={() => handleAnswer(questions[userProgress].userAnswer)}>
            Submit Answer
          </button>
        </div>
      )}

<Progress className="progressbar" percent={(userProgress / questions.length) * 100 + 5} indicating />
            <progress value={100} max={100}/>
    </div>
    </div>
    
  );
};

export default LevelDetailPage;