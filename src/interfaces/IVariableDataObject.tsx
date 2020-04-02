interface IVariableDataObject {
	name: string,
	value: string, // need stringly typing to make entering decimals possible
	setFunction(value: string): void,
	unit: string,
	variableName: number // comes from enum VariableNames
}

export default IVariableDataObject;