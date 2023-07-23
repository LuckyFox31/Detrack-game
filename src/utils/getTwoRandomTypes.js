import {dataTypesArray} from "../constants/dataTypes.js";

export default function getTwoRandomTypes(){
	const randomTypes = [];

	for (let i = 0; i < 2; i++) {
		const randomTypeIndex = Math.floor(Math.random() * dataTypesArray.length);
		const randomType = dataTypesArray[randomTypeIndex];
		randomTypes.push(randomType);
	}

	return randomTypes;
}