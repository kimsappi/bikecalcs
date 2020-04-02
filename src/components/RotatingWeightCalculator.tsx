import React, {useState} from 'react';
import IVariableDataObject from '../interfaces/IVariableDataObject';
import VariableNames from '../enums/VariableNames';

const RotatingWeightInput =
  ({stateObject, eventHandler}:
    {stateObject: IVariableDataObject, eventHandler: any}) => (
  <div>
    {stateObject.name}
    <input
      type='text'
      value={stateObject.value}
      onChange={eventHandler}
      id={stateObject.name.replace(' ', 'idSpacePlaceholder')}
    />
    {stateObject.unit}
  </div>
);

const RotatingWeightInputs = ({inputData}: {inputData: Array<IVariableDataObject>}) => {

  /* Single function for handling the state changes of all input values */
  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventTargetId = event.target.id.replace('idSpacePlaceholder', ' ');
    const dataObject = inputData.filter(object => object.name === eventTargetId)[0];
    dataObject.setFunction(event.target.value);
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
      <input type='text' disabled value={data.value}></input>
    </div>
  );
};

const RotatingWeightOutputs = ({inputData, outputData}:
  {inputData: Array<IVariableDataObject>, outputData: Array<IVariableDataObject>}) => {

  /* Calculate moment of interia */
  const momentOfInertiaCalculator = (inputData: Array<IVariableDataObject>): number => {
    const rimWeight = Number(inputData.filter(data => data.variableName === VariableNames.rimWeight)[0].value);
    const tyreCircumference = Number(inputData.filter(data => data.variableName === VariableNames.tyreCircumference)[0].value);
    // Circumference = 2*pi*radius. The radius should be a bit smaller,
    // so we use a magic constant & unit conversion
    const rimRadius = tyreCircumference / 3.4 / 2 / 1000;
    return (rimWeight / 1000 * Math.pow(rimRadius, 2));
  };

  /* Calculate angular velocity of wheels */
  const angularVelocityCalculator = (inputData: Array<IVariableDataObject>): number => {
    const tyreCircumference = Number(inputData.filter(data => data.variableName === VariableNames.tyreCircumference)[0].value);
    const speed = Number(inputData.filter(data => data.variableName === VariableNames.speed)[0].value);
    // Speed is in km/h, need to convert to m/s, tyreCircumference mm->m
    return (2 * Math.PI * (speed / 3.6) / (tyreCircumference / 1000));
  };

  /* Calculate power required for rotational acceleration */
  const rotationalAccelerationPowerCalculator = (inputData: Array<IVariableDataObject>) => {
    const momentOfInertia = momentOfInertiaCalculator(inputData);
    const angularVelocity = angularVelocityCalculator(inputData);
    const rotationalEnergy = momentOfInertia * Math.pow(angularVelocity, 2) / 2;
    const accelerationTime = Number(inputData.filter(data => data.variableName === VariableNames.accelerationTime)[0].value);
    return (rotationalEnergy / accelerationTime);
  };

  /* Calculate power required to translationally accelerate body+bike */
  const translationalAccelerationPowerCalculator = (inputData: Array<IVariableDataObject>) => {
    const bikeWeight = Number(inputData.filter(data => data.variableName === VariableNames.bikeWeight)[0].value);
    const bodyWeight = Number(inputData.filter(data => data.variableName === VariableNames.bodyWeight)[0].value);
    const accelerationTime = Number(inputData.filter(data => data.variableName === VariableNames.accelerationTime)[0].value);
    const speed = Number(inputData.filter(data => data.variableName === VariableNames.speed)[0].value);
    return (0.5 * (bikeWeight + bodyWeight) * Math.pow(speed / 3.6, 2) / accelerationTime);
  };

  /* Calculate output results and set the states */
  const rotationalPower = rotationalAccelerationPowerCalculator(inputData);
  const translationalPower = translationalAccelerationPowerCalculator(inputData);
  const powerIsNaNMessage = 'Please enter valid numbers!';
  outputData[0].setFunction(isNaN(rotationalPower) ? powerIsNaNMessage : rotationalPower.toString());
  outputData[1].setFunction(isNaN(translationalPower) ? powerIsNaNMessage : translationalPower.toString());

  return (
    <div>
      <RotatingWeightOuput data={outputData[0]} />
      <RotatingWeightOuput data={outputData[1]} />
      <input
        type='range' min='0' max='1' step='0.001' readOnly
        value={Number(outputData[0].value) / (Number(outputData[0].value) + Number(outputData[1].value))}
      />
    </div>
  )
};

const RotatingWeightCalculator = () => {
  const [rimWeight, setRimWeight] = useState('1200');
  const [bodyWeight, setBodyWeight] = useState('70');
  const [bikeWeight, setBikeWeight] = useState('7.5');
  const [tyreCircumference, setTyreCircumference] = useState('2105');
  const [speed, setSpeed] = useState('30');
  const [accelerationTime, setAccelerationTime] = useState('5');
  const [rotationalPower, setRotationalPower] = useState('0');
  const [translationalPower, setTranslationalPower] = useState('0');

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

export default RotatingWeightCalculator;