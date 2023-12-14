// import React from 'react';
// import { AiOutlinePlus } from 'react-icons/ai';
// import { useState } from 'react';
// import { Todo } from './Todo.jsx';

// const style = {
//   container: {
//     width: '400px',
//     margin: '0 auto',
//     height: '500px', 
//     marginTop: '20px', // Adjust as needed
//     marginRight: '20px', // Adjust as needed
//     padding: '20px',
//     background: 'linear-gradient(to right, #2F80ED, #1CB5E0)',
//     borderRadius: '10px',
//     boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
//   },
//   heading: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#888',
//     marginBottom: '10px',
//   },
//   form: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginBottom: '10px',
//   },
//   input: {
//     border: '1px solid #ccc',
//     padding: '8px',
//     fontSize: '18px',
//     width: '100%',
//   },
//   button: {
//     border: 'none',
//     padding: '10px',
//     marginLeft: '10px',
//     backgroundColor: 'purple',
//     color: 'white',
//     cursor: 'pointer',
//   },
//   list: {
//     listStyle: 'none',
//     padding: 0,
//     fontSize: '18px',
//   },
// };

// export const Schedule = () => {
//   const [todos, setTodos] = useState(['Learn React', 'Write Leet Code']);
//   const [newTodo, setNewTodo] = useState('');

//   const addTodo = () => {
//     if (newTodo.trim() !== '') {
//       setTodos([...todos, newTodo]);
//       setNewTodo('');
//     }
//   };

//   return (
//     <div style={style.container}>
//       <h3 style={style.heading}>Todo App</h3>
//       <div style={style.form}>
//         <input
//           style={style.input}
//           type="text"
//           placeholder="Add Todo"
//           value={newTodo}
//           onChange={(e) => setNewTodo(e.target.value)}
//         />
//         <button style={style.button} onClick={addTodo}>
//           <AiOutlinePlus size={30} />
//         </button>
//       </div>
//       <ul style={style.list}>
//         {todos.map((todo, index) => (
//           <Todo key={index} todo={todo} />
//         ))}
//       </ul>
//     </div>
//   );
// };
