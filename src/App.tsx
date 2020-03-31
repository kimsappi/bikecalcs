import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './App.css';

interface IInputDataObject {
  name: string,
  value: number,
  setFunction(value: number): void,
  unit: string
}

const Nav = () => (
  <nav id='navbar'>
    <ul>
      <Link to='/'><li>Climbing weight</li></Link>
      <Link to='/gearing'><li>Gearing</li></Link>
    </ul>
  </nav>
);

const RotatingWeightInput =
  ({stateObject, eventHandler}:
    {stateObject: IInputDataObject, eventHandler: any}) => (
  <div>
    {stateObject.name}
    <input
      type='number'
      value={stateObject.value}
      onChange={eventHandler}
      id={stateObject.name.replace(' ', 'idSpacePlaceholder')}>
    </input>
    {stateObject.unit}
  </div>
);

const RotatingWeightInputs = ({inputData}: {inputData: Array<IInputDataObject>}) => {

  /* Single function for handling the state changes of all input values */
  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventTargetId = event.target.id.replace('idSpacePlaceholder', ' ');
    const dataObject = inputData.filter(object => object.name === eventTargetId)[0];
    dataObject.setFunction(Number(event.target.value));
  };

  return (
    <>
      {inputData.map(entry => 
      <RotatingWeightInput
        stateObject={entry}
        eventHandler={handleDataChange}
        key={entry.name}
      />
      )}
    </>
  );
};

const RotatingWeightCalculator = () => {
  const [rimWeight, setRimWeight] = useState(1200);
  const [bodyWeight, setBodyWeight] = useState(70);
  const [bikeWeight, setBikeWeight] = useState(7.5);
  const [tyreCircumference, setTyreCircumference] = useState(2105);
  const [speed, setSpeed] = useState(1800);
  const [accelerationTime, setAccelerationTime] = useState(5);

  const inputData: Array<IInputDataObject> = [
    {name: 'Rim weight', value: rimWeight, setFunction: setRimWeight, unit: 'g'},
    {name: 'Body weight', value: bodyWeight, setFunction: setBodyWeight, unit: 'kg'},
    {name: 'Bike weight', value: bikeWeight, setFunction: setBikeWeight, unit: 'kg'},
    {name: 'Tyre circumference', value: tyreCircumference, setFunction: setTyreCircumference, unit: 'mm'},
    {name: 'Speed', value: speed, setFunction: setSpeed, unit: 'km/h'},
    {name: 'Acceleration time', value: accelerationTime, setFunction: setAccelerationTime, unit: 's'}
  ];

  return (
    <div>
      <RotatingWeightInputs inputData={inputData} />
    </div>
  );
};

function App() {
  return (
    <>
      <Nav />
      <RotatingWeightCalculator />
    </>
  );
};

export default App;
