import React from 'react';
import { useMachine } from '@xstate/react';
import logo from './logo.svg';
import './App.css';
import { machine } from './machine';

const App = () => {
  const [current, send] = useMachine(machine, { devTools: true });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {current.value}
        </p>
      </header>
    </div>
  );
}

export default App;
