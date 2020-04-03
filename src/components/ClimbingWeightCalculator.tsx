import React, {useState} from 'react';
import IVariableDataObject from '../interfaces/IVariableDataObject';
import VariableNames from '../enums/VariableNames';
import VariableDataObjectInputs from './VariableDataObjectInputs';
import GetInputDataObjectValueFromArray from '../functions/GetInputDataObjectValueFromArray';

const ClimbingWeightCalculatorOutputs = ({inputData}: {inputData: Array<IVariableDataObject>}) => {
	const bikeWeight = Number(GetInputDataObjectValueFromArray(inputData, VariableNames.speed));
	const bodyWeight =  Number(GetInputDataObjectValueFromArray(inputData, VariableNames.bodyWeight));
	const weightDifference =  Number(GetInputDataObjectValueFromArray(inputData, VariableNames.weightDifference));
	const incline =  Number(GetInputDataObjectValueFromArray(inputData, VariableNames.incline));
	const speed =  Number(GetInputDataObjectValueFromArray(inputData, VariableNames.speed));
	const climbTimes = GetInputDataObjectValueFromArray(inputData, VariableNames.climbTimes);

	// Check the input values are numbers
	const checkInput = [bikeWeight, bodyWeight, weightDifference, incline, speed].filter(datum => isNaN(datum));
	if (checkInput.length > 0)
		return (<div>Please enter valid numbers!</div>);

	// Split and filter climb times into array, map resultring str array to number array
	const climbTimesArray = climbTimes
		.replace(' ', '')
		.split(',')
		.filter(time => time.length > 0 && !isNaN(Number(time)) && Number(time) > 0)
		.map(timeString => Number(timeString));
	
	if (!climbTimesArray.length)
		return (<div>Please enter at least one valid climb time!</div>);

	return (<div>{climbTimesArray[0]}</div>);
};

const ClimbingWeightCalculator = () => {
	const [bodyWeight, setBodyWeight] = useState('70');
	const [bikeWeight, setBikeWeight] = useState('7.5');
	const [weightDifference, setWeightDifference] = useState('-1');
	const [incline, setIncline] = useState('5');
	const [climbTimes, setClimbTimes] = useState('5,20,60');
	const [speed, setSpeed] = useState('20');

	const inputData: Array<IVariableDataObject> = [
		{name: 'Body weight', value: bodyWeight, setFunction: setBodyWeight, unit: 'kg', variableName: VariableNames.bodyWeight},
		{name: 'Bike weight', value: bikeWeight, setFunction: setBikeWeight, unit: 'kg', variableName: VariableNames.bikeWeight},
		{name: 'Weight difference', value: weightDifference, setFunction: setWeightDifference, unit: 'kg', variableName: VariableNames.weightDifference},
		{name: 'Incline', value: incline, setFunction: setIncline, unit: '%', variableName: VariableNames.incline},
		{name: 'Climb times', value: climbTimes, setFunction: setClimbTimes, unit: 'minutes', variableName: VariableNames.climbTimes},
		{name: 'Speed', value: speed, setFunction: setSpeed, unit: 'km/h', variableName: VariableNames.speed}
	];

	return (
		<>
			<VariableDataObjectInputs inputData={inputData} />
			<ClimbingWeightCalculatorOutputs inputData={inputData} />
		</>
	);
}

export default ClimbingWeightCalculator;