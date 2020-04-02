import React, {useState} from 'react';
import IVariableDataObject from '../interfaces/IVariableDataObject';
import VariableNames from '../enums/VariableNames';
import VariableDataObjectInputs from './VariableDataObjectInputs';

const ClimbingWeightCalculator = () => {
	const [bodyWeight, setBodyWeight] = useState('70');
	const [bikeWeight, setBikeWeight] = useState('7.5');
	const [weightDifference, setWeightDifference] = useState('-1');
	const [incline, setIncline] = useState('5');
	const [climbTimes, setClimbTimes] = useState('5,20,60');

	const inputData: Array<IVariableDataObject> = [
		{name: 'Body weight', value: bodyWeight, setFunction: setBodyWeight, unit: 'kg', variableName: VariableNames.bodyWeight},
		{name: 'Bike weight', value: bikeWeight, setFunction: setBikeWeight, unit: 'kg', variableName: VariableNames.bikeWeight},
		{name: 'Weight difference', value: weightDifference, setFunction: setWeightDifference, unit: 'kg', variableName: VariableNames.weightDifference},
		{name: 'Incline', value: incline, setFunction: setIncline, unit: '%', variableName: VariableNames.incline},
		{name: 'Climb times', value: climbTimes, setFunction: setClimbTimes, unit: 'minutes', variableName: VariableNames.climbTimes}
	];

	return (
		<VariableDataObjectInputs inputData={inputData} />
	);
}

export default ClimbingWeightCalculator;