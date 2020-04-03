import React, {useState} from 'react';
import IVariableDataObject from '../interfaces/IVariableDataObject';
import IClimbDataObject from '../interfaces/IClimbDataObject';
import VariableNames from '../enums/VariableNames';
import VariableDataObjectInputs from './VariableDataObjectInputs';
import GetInputDataObjectValueFromArray from '../functions/GetInputDataObjectValueFromArray';

const ClimbingWeightCalculatorOutputTableRow = ({climbData}: {climbData: IClimbDataObject}) => {
	const differenceStr = Math.abs(climbData.difference) > 120 ?
		(climbData.difference / 60).toString().concat(' minutes') :
		climbData.difference.toString().concat(' seconds');
	return (
		<>
			<td>
				{climbData.climbTime} minutes
			</td>
			<td>
				{climbData.newClimbTime} minutes
			</td>
			<td>
				{differenceStr}
			</td>
		</>
	);
};

const ClimbingWeightCalculatorOutputTable = ({originalWeight, newWeight, climbTimes, speed}:
	{originalWeight: number, newWeight: number, climbTimes: Array<number>, speed: number}) => {

	const climbData: Array<IClimbDataObject> = climbTimes
		.map(time => {
			return {
				climbTime: time,
				newClimbTime: time * newWeight / originalWeight,
				difference: (time * newWeight / originalWeight - time) * 60
			};
		});
	
	/* Data for Alpe d'Huez climb as a reference */
	const alpeClimbTime = 13.8 / speed * 60;
	const alpeClimbData: IClimbDataObject = {
		climbTime: alpeClimbTime,
		newClimbTime: alpeClimbTime * newWeight / originalWeight,
		difference: (alpeClimbTime * newWeight / originalWeight - alpeClimbTime) * 60
	};
	
	return (
		<table>
			<thead>
				<tr>
					<th>Original time</th>
					<th>New time</th>
					<th>Difference</th>
				</tr>
			</thead>
			<tbody>
				{climbData.map(climbData => 
				<tr key={Math.random().toString()}>
					<ClimbingWeightCalculatorOutputTableRow climbData={climbData} />
				</tr>)}
				<tr>
					<ClimbingWeightCalculatorOutputTableRow climbData={alpeClimbData} />
					<td>Alpe d'Huez at {speed} km/h</td>
				</tr>
			</tbody>
		</table>
	);
};

const ClimbingWeightCalculatorOutputs = ({inputData}: {inputData: Array<IVariableDataObject>}) => {
	const bikeWeight = Number(GetInputDataObjectValueFromArray(inputData, VariableNames.speed));
	const bodyWeight =  Number(GetInputDataObjectValueFromArray(inputData, VariableNames.bodyWeight));
	const weightDifference =  Number(GetInputDataObjectValueFromArray(inputData, VariableNames.weightDifference));
	const speed =  Number(GetInputDataObjectValueFromArray(inputData, VariableNames.speed));
	const climbTimes = GetInputDataObjectValueFromArray(inputData, VariableNames.climbTimes);

	// Check the input values are numbers
	const checkInput = [bikeWeight, bodyWeight, weightDifference, speed].filter(datum => isNaN(datum));
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

	return (
		<ClimbingWeightCalculatorOutputTable
			originalWeight={bikeWeight + bodyWeight}
			newWeight={bikeWeight + bodyWeight + weightDifference}
			climbTimes={climbTimesArray}
			speed={speed}
		/>
	);
};

const ClimbingWeightCalculator = () => {
	const [bodyWeight, setBodyWeight] = useState('70');
	const [bikeWeight, setBikeWeight] = useState('7.5');
	const [weightDifference, setWeightDifference] = useState('-1');
	const [climbTimes, setClimbTimes] = useState('5,20,60');
	const [speed, setSpeed] = useState('20');

	const inputData: Array<IVariableDataObject> = [
		{name: 'Body weight', value: bodyWeight, setFunction: setBodyWeight, unit: 'kg', variableName: VariableNames.bodyWeight},
		{name: 'Bike weight', value: bikeWeight, setFunction: setBikeWeight, unit: 'kg', variableName: VariableNames.bikeWeight},
		{name: 'Weight difference', value: weightDifference, setFunction: setWeightDifference, unit: 'kg', variableName: VariableNames.weightDifference},
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