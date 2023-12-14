import React from 'react';
import { Authh } from './Auth/Authh';
import { motion } from 'framer-motion';
import { Schedule } from '../components/scheduler/schedule';
import { Todo } from '../components/Todo';
import '../styles/dash.css';

export const Dash = (props) => {
  return (
    <div className="dashboard">
      <div className="background-image"></div>

      <div className="content">
        <h1 className="welcome">Welcome Back {props.name}</h1>

        <div className="schedule">
          <Todo />
        </div>
      </div>
    </div>
  );
};

