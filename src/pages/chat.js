import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, serverTimestamp, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { motion } from 'framer-motion';
import { Container, Card, Typography, TextField, Button, Divider } from '@mui/material';

export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, 'messages');

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where('room', '==', room),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [room]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (newMessage === '') {
      return;
    }

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      uid: auth.currentUser.uid,
      room,
      read: false,
    });

    setNewMessage('');
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        border: '2px solid #e0e0e0',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      <header
        sx={{
          width: '100%',
          padding: '1rem',
          backgroundColor: '#2196f3',
          borderBottom: '2px solid #e0e0e0',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          marginBottom: '1rem',
          textAlign: 'center',
          justifyContent:"center",
        }}
      >
        <Typography variant="h4" sx={{ color: '#000000', fontWeight: 'bold' }}>
          {room}
        </Typography>
      </header>

      <div
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1rem', // Added spacing between messages
        }}
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: message.uid === auth.currentUser.uid ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: message.uid === auth.currentUser.uid ? 10 : -10 }}
          >
            <Card
              sx={{
                backgroundColor: '#ffffff',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.uid === auth.currentUser.uid ? 'flex-end' : 'flex-start',
                width: '80%',
                alignSelf: message.uid === auth.currentUser.uid ? 'flex-end' : 'flex-start',
                marginTop:"5px",
              }}
            >
              <Typography variant="body1" sx={{ color: '#000000' }}>
                {message.text}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2196f3' }}
              >
                {message.user}
              </Typography>
            </Card>
          </motion.div>
        ))}
      </div>

      <Divider />

      <div
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem',
          borderTop: '2px solid #e0e0e0',
          width: '100%',
          border:"black",
          borderRadius:"25px",
          
        }}
      >
        <TextField
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          variant="outlined"
          placeholder="Type a message"
          sx={{ flex: 1,left:"60%" ,marginTop:"20%" }}
        />
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmitForm}
        sx={{ marginTop:"21%" ,left:"62%" }}
        >
          Submit
        </Button>
      </div>
    </Container>
  );
};
