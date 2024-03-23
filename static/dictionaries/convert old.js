import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

import pkg from 'lodash';
const { sortBy, sortedUniqBy } = pkg;

import fuzzysort from 'fuzzysort';

// import { sortBy, sortedUniqBy } from 'lodash';

const inputPath = './src/lib/dictionaries/raw'; // Change this to your folder path
const outputPath = './src/lib/dictionaries/optimized';

// Function to parse CSV file
function parseCSV(filePath) {
	const fileContent = fs.readFileSync(filePath, 'utf8');
	const parsed = Papa.parse(fileContent, { header: true });
	return parsed.data;
}

// Function to read all CSV files in a folder and create JS files
function readCSVFiles(folderPath) {
	const files = fs.readdirSync(folderPath);
	files.forEach(function (file) {
		const filePath = path.join(folderPath, file);
		if (path.extname(filePath).toLowerCase() === '.csv') {
			console.log('Parsing CSV...', file);
			const parsedData = parseCSV(filePath);
			console.log('Preparing Data...');
			const preparedData = prepareData(parsedData);
			const jsFileName = path.basename(file, '.csv') + 'json.';
			const outputFile = path.join(outputPath, jsFileName);
			console.log('Writing JSON to File...', jsFileName);
			writeJSFile(outputFile, preparedData);
		}
	});
}

function prepareData(data) {
	let array = [];
	data.forEach((obj) => {
		if (!obj || !obj.en || !obj.de) console.log('Weird object!', obj);
		array.push({ s: fuzzysort.prepare(cleanTerm(obj.de)), l: 'de' });
		array.push({ s: fuzzysort.prepare(cleanTerm(obj.en)), l: 'en' });
	});

	// console.log("🚀 ~ data.forEach ~ array:", array);
	// const sorted = sortBy(array, [function(obj) { return obj.s; }]);
	// console.log("🚀 ~ prepareData ~ sorted:", sorted);
	// console.log("🚀 ~ prepareData ~ sorted.length:", sorted.length);
	// const withoutDuplicates = sortedUniqBy(sorted, obj => obj.s + obj.l)
	// console.log("🚀 ~ prepareData ~ withoutDuplicates.length:", withoutDuplicates.length);
	// console.log("🚀 ~ prepareData ~ withoutDuplicates:", withoutDuplicates);
	return array;
}

// const array = [];

// 		data.forEach((obj) => {
// 			array.push({ str: fuzzysort.prepare(obj.de), language: 'de' });
// 			array.push({ str: fuzzysort.prepare(obj.en), language: 'en' });
// 		});

function cleanTerm(originalString) {
	// remove all parts in {} [] () brackets
	const cleaned = originalString?.replace(/\{.*?\}|\(.*?\)|\[.*?\]|<.*?>/g, '');

	// remove unnecessary whitespaces
	const trimmed = cleaned?.trim().replace(/ +/g, ' ');

	// if (!originalString || !trimmed)
		// console.log("original:", originalString, "    cleaned:", trimmed);

	return trimmed;
}

// Function to write parsed data to a JS file
function writeJSFile(outputFile, parsedData) {
	const fileContent = JSON.stringify(parsedData);
	fs.writeFileSync(outputFile, fileContent);
}

// Function to format data as JavaScript object
function formatDataAsJS(data) {
	const jsString = [];
	jsString.push('export const dictionaryData = [');
	data.forEach((obj) => {
		jsString.push(`{en: "${obj.en}", de: "${obj.de}"}, `);
	});
	jsString.push(']');

	console.log('🚀 ~ formatDataAsJS ~ jsString:', jsString);
	return jsString.join('');

	// const formattedData = data.map(function(entry) {
	//     const formattedEntry = {};
	//     Object.keys(entry).forEach(function(key) {
	//         formattedEntry[key] = entry[key];
	//     });
	//     return formattedEntry;
	// });
	// return formattedData;
	// return JSON.stringify(formattedData, null, 2);
}

// Main function to orchestrate the process
function main() {
	console.log(process.memoryUsage());
	readCSVFiles(inputPath);
}

// Execute the main function
main();
