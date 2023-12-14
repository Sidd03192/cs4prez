import React, { useState, useRef } from 'react';
import { Authh } from './Auth/Authh';
import Cookies from 'universal-cookie';
import { Chat } from './chat';
import { TextField, Button, Card, CardContent } from '@mui/material';

const cookies = new Cookies();

export const Roomz = () => {
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  const [room, setRoom] = useState('');
  const roomInputRef = useRef(null);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-black">Hello</h1>
          <Authh setIsAuth={setIsAuth} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100"
    style={{
      backgroundImage:
            'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
    }}
    >
      {room ? (
        <Chat room={room}></Chat>
      ) : (
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-black w-full">Enter Room Name:</h1>
          <TextField
            placeholder="Room Name"
            inputRef={roomInputRef}
            className="mb-4 w-full"
          />
          <Button
            onClick={() => setRoom(roomInputRef.current.value)}
            variant="contained"
            color="primary"
          >
            Enter Chat
          </Button>
        </div>
      )}
    </div>
  );
};
