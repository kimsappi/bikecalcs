import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Nav from './components/Nav';
import RotatingWeightCalculator from './components/RotatingWeightCalculator';
import ClimbingWeightCalculator from './components/ClimbingWeightCalculator';
import './App.css';

function App() {
  return (
    <>
      <Nav />
      <Switch>
        <Route path='/climbing_calculator'>
          <ClimbingWeightCalculator />
        </Route>
        <Route path='/'>
          <RotatingWeightCalculator />
        </Route>
      </Switch>
    </>
  );
};

export default App;
