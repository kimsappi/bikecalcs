import IVariableDataObject from '../interfaces/IVariableDataObject';

const GetInputDataObjectValueFromArray = (
		inputData: Array<IVariableDataObject>,
		variableName: Number
	) =>
	inputData.filter(datum => datum.variableName === variableName)[0].value;

export default GetInputDataObjectValueFromArray;
