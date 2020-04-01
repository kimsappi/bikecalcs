import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './App.css';

interface IVariableDataObject {
  name: string,
  value: number,
  setFunction(value: number): void,
  unit: string,
  variableName: number // comes from enum VariableNames
}

enum VariableNames {
  rimWeight,
  bodyWeight,
  bikeWeight,
  tyreCircumference,
  speed,
  accelerationTime,
  rotationalPower,
  translationalPower
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
    {stateObject: IVariableDataObject, eventHandler: any}) => (
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

const RotatingWeightInputs = ({inputData}: {inputData: Array<IVariableDataObject>}) => {

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

const RotatingWeightOuput = ({data}: {data: IVariableDataObject}) => {
  return (
    <div>
      {data.name}
      <input type='number' disabled value={data.value}></input>
    </div>
  );
};

const RotatingWeightOutputs = ({inputData, outputData}:
  {inputData: Array<IVariableDataObject>, outputData: Array<IVariableDataObject>}) => {

  /* Calculate moment of interia */
  const momentOfInertiaCalculator = (inputData: Array<IVariableDataObject>): number => {
    const rimWeight = inputData.filter(data => data.variableName === VariableNames.rimWeight)[0].value;
    const tyreCircumference = inputData.filter(data => data.variableName === VariableNames.tyreCircumference)[0].value;
    const rimRadius = tyreCircumference / 3.4; // Magic constant a bit larger than pi
    return (rimWeight / 1000 * Math.pow(rimRadius, 2));
  };

  /* Calculate angular velocity of wheels */
  const angularVelocityCalculator = (inputData: Array<IVariableDataObject>): number => {
    const tyreCircumference = inputData.filter(data => data.variableName === VariableNames.tyreCircumference)[0].value;
    const speed = inputData.filter(data => data.variableName === VariableNames.speed)[0].value;
    return (speed / tyreCircumference / 3600 * 2 * Math.PI);
  };

  /* Calculate power required for rotational acceleration */
  const rotationalAccelerationPowerCalculator = (inputData: Array<IVariableDataObject>) => {
    const momentOfInertia = momentOfInertiaCalculator(inputData);
    const angularVelocity = angularVelocityCalculator(inputData);
    const rotationalEnergy = momentOfInertia * Math.pow(angularVelocity, 2) / 2;
    const accelerationTime = inputData.filter(data => data.variableName === VariableNames.accelerationTime)[0].value;
    return (rotationalEnergy / accelerationTime);
  };

  /* Set acceleration power state to result of calculation */
  outputData[0].setFunction(rotationalAccelerationPowerCalculator(inputData));

  return (
    <div>
      <RotatingWeightOuput data={outputData[0]} />
      <RotatingWeightOuput data={outputData[1]} />
    </div>
  )
};

const RotatingWeightCalculator = () => {
  const [rimWeight, setRimWeight] = useState(1200);
  const [bodyWeight, setBodyWeight] = useState(70);
  const [bikeWeight, setBikeWeight] = useState(7.5);
  const [tyreCircumference, setTyreCircumference] = useState(2105);
  const [speed, setSpeed] = useState(30);
  const [accelerationTime, setAccelerationTime] = useState(5);
  const [rotationalPower, setRotationalPower] = useState(0);
  const [translationalPower, setTranslationalPower] = useState(0);

  const inputData: Array<IVariableDataObject> = [
    {name: 'Rim weight', value: rimWeight, setFunction: setRimWeight, unit: 'g', variableName: VariableNames.rimWeight},
    {name: 'Body weight', value: bodyWeight, setFunction: setBodyWeight, unit: 'kg', variableName: VariableNames.bodyWeight},
    {name: 'Bike weight', value: bikeWeight, setFunction: setBikeWeight, unit: 'kg', variableName: VariableNames.bikeWeight},
    {name: 'Tyre circumference', value: tyreCircumference, setFunction: setTyreCircumference, unit: 'mm', variableName: VariableNames.tyreCircumference},
    {name: 'Speed', value: speed, setFunction: setSpeed, unit: 'km/h', variableName: VariableNames.speed},
    {name: 'Acceleration time', value: accelerationTime, setFunction: setAccelerationTime, unit: 's', variableName: VariableNames.accelerationTime}
  ];

  const outputData: Array<IVariableDataObject> = [
    {name: 'Power required to accelerate wheels', value: rotationalPower, setFunction: setRotationalPower, unit: 'W', variableName: VariableNames.rotationalPower},
    {name: 'Power required to accelerate the bike and yourself', value: translationalPower, setFunction: setTranslationalPower, unit: 'W', variableName: VariableNames.translationalPower}
  ];

  return (
    <div>
      <RotatingWeightInputs inputData={inputData} />
      <RotatingWeightOutputs inputData={inputData} outputData={outputData} />
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
