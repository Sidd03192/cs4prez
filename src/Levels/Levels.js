import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import AddLevelForm from './AddLevelForm';
import {math} from "./math.jpg";
import Rating from '@mui/material/Rating';
import "./Levels.css";

const LevelsPage = (props) => {
  const { levelId } = useParams();
  const [user, setUser] = useState(getAuth().currentUser);
  const [levels, setLevels] = useState([]);

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

    fetchLevels();
  }, []);

  return (
    <div className="level">
      <h1 className='pagehead'>Levels</h1>
    <div className='content-container'>

    </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {levels.map((level) => (
          <Card key={level.id} sx={{ maxWidth: 270, maxHeight:350 }}>
            <CardActionArea component={Link} to={`/level/${level.id}`}>
              <CardMedia
                component="img"
                height="100"
                image={"https://img.freepik.com/free-vector/math-chalkboard-background_23-2148172795.jpg"} 
                alt={`Level ${level.id}`}
                style={{ maxHeight: '100%' }}

              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {`${level.id}`}
                  
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
        
      </div>

      {user && (
        <>
          <p>Hi {user.displayName}! Let's get to learning</p>
          {/* Render AddLevelForm only for me! */}
          {user.uid === 'HFI6oa0nZcM3bZeWsvidUaMqMoi2' && <AddLevelForm currentUser={user} />}
        </>
      )}
    </div>
  );
};

export default LevelsPage;
