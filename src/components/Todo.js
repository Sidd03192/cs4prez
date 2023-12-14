import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addDoc, collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const Todo = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [auth]);

  useEffect(() => {
    const fetchTodos = async () => {
      if (currentUser) {
        const userTodosRef = collection(db, 'users', currentUser.uid, 'todos');
        const querySnapshot = await getDocs(userTodosRef);
        const todosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todosData);
        console.log('Todos fetched:', todosData);
      }
    };
  
    fetchTodos();
  }, [currentUser]);
  

  const handleAddTodo = async (e) => {
    e.preventDefault();
  
    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }
  
    const userTodosRef = collection(db, 'users', currentUser.uid, 'todos');
  
    try {
      const newTodoRef = await addDoc(userTodosRef, {
        name: taskName,
        time: taskTime,
      });
  
      // Update todos state immediately after adding a new todo
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: newTodoRef.id, name: taskName, time: taskTime },
      ]);
  
      // Clear the input fields after adding a new todo
      setTaskName('');
      setTaskTime('');
  
      console.log('Todo added successfully!');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  
  const handleDeleteTodo = async (todoId) => {
    const userTodoDocRef = doc(db, 'users', currentUser.uid, 'todos', todoId);
  
    try {
      await deleteDoc(userTodoDocRef);
  
      // Update todos state immediately after deletion
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
  
      console.log('Todo deleted successfully!');
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '12px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography component="h1" variant="h5" style={{width:"100%", textAlign:"center"}}>
          Add Todo
        </Typography>
        <List style={{ marginTop: '1rem', width: '100%',color:"whitesmoak" }}>
          {todos.map((todo) => (
             <ListItem
             key={todo.id}
             sx={{
               backgroundColor: '#F5F5F5', 
               borderRadius: '8px',
               '&:hover': {
                
                 boxShadow: '0px 0px 5px rgba(0, 128, 0, 0.5)', // green box shadow on hover
               },
             }}
           >
              <ListItemText primary={todo.name} secondary={todo.time} />
              <ListItemSecondaryAction>
              <IconButton
                  onClick={() => handleDeleteTodo(todo.id)}
                  edge="end"
                  aria-label="delete"
                  sx={{ color: 'red' }} // red color for delete button
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <form onSubmit={handleAddTodo} style={{ width: '100%', marginTop: '1rem' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="taskName"
                label="Task Name"
                name="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="taskTime"
                label="Task Time"
                name="taskTime"
                type="time"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: '1rem' }}
          >
            Add Todo
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
