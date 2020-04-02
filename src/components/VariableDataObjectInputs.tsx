import React from 'react';
import IVariableDataObject from '../interfaces/IVariableDataObject';

const VariableDataObjectInput =
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

const VariableDataObjectInputs = ({inputData}: {inputData: Array<IVariableDataObject>}) => {

  /* Single function for handling the state changes of all input values */
  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventTargetId = event.target.id.replace('idSpacePlaceholder', ' ');
    const dataObject = inputData.filter(object => object.name === eventTargetId)[0];
    dataObject.setFunction(event.target.value);
  };

  return (
    <>
      {inputData.map(entry => 
      <VariableDataObjectInput
        stateObject={entry}
        eventHandler={handleDataChange}
        key={entry.name}
      />
      )}
    </>
  );
};

export default VariableDataObjectInputs;