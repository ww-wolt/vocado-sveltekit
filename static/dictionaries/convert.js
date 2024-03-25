const languages = ['de', 'fr', 'en'];

const INPUT_PATH = './static/dictionaries/raw';
const OUTPUT_PATH = './static/dictionaries/optimized';

const SEPARATOR = '֍';

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

import pkg from 'lodash';
const { groupBy, deburr } = pkg;

// import { map, tail, times, uniq } from 'lodash';
// import map from 'lodash/map';

function parseCSVFile(filePath) {
	console.log('Parsing CSV...', filePath);
	const fileContent = fs.readFileSync(filePath, 'utf8');
	const parsed = Papa.parse(fileContent, { header: true });
	return parsed.data;
}

function cleanTerm(originalString) {
	// remove all parts in {} [] () brackets
	const cleaned = originalString?.replace(/\{.*?\}|\(.*?\)|\[.*?\]|<.*?>/g, '');

	// remove unnecessary whitespaces
	const trimmed = cleaned?.trim().replace(/ +/g, ' ');

	// if (!originalString || !trimmed)
	// console.log("original:", originalString, "    cleaned:", trimmed);

	return trimmed;
}

function prepareData(data) {
	console.log('Preparing Data...');

	let stringArray = [];

	data.forEach((obj) => {
		languages.forEach((lang) => {
			if (obj[lang]) {
				const cleanedTerm = cleanTerm(obj[lang]);
				if (cleanedTerm) stringArray.push(cleanedTerm + SEPARATOR + lang);
			}
		});
	});

	console.log('Original length:', stringArray.length);

	// Using Set to remove duplicates
	const noDuplicates = Array.from(new Set(stringArray));
	console.log('Without duplicates:', noDuplicates.length);

	// console.log("🚀 ~ prepareData ~ noDuplicates:", noDuplicates);

	// countStringsByFirstLetter(noDuplicates)
	// console.log("🚀 ~ prepareData ~ countStringsByFirstLetter(noDuplicates):", countStringsByFirstLetter(noDuplicates));

	const splitted = splitBySearchGroup(noDuplicates);

	return splitted;
}

function writeDataToFiles(folderName, dataObj) {
	console.log('Writing data to files...');
	const folderPath = path.join(OUTPUT_PATH, folderName);

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath);
	}

	// console.log('🚀 ~ writeDataToFiles ~ dataObj:', dataObj);
	try {
		// Loop through each property of the dataObj
		for (let key in dataObj) {
			// Check that property is real and not inherited from prototype
			if (Object.prototype.hasOwnProperty.call(dataObj, key)) {
				const filename = path.join(folderPath, `${key}.txt`);
				const content = dataObj[key].join('\n');

				// Write content to file
				fs.writeFileSync(filename, content, 'utf8');
				// console.log(`Data written to ${filename}`);
			}
		}
	} catch (err) {
		console.error('Error writing data to files:', err);
	}
	console.log('Finished writing.');
	console.log('');
}

// function countStringsByFirstLetter(strings) {
// 	const letterCounts = mapValues(
// 		groupBy(strings, (string) => {
// 			const normalizedFirstLetter = deburr(string.charAt(0)).toLowerCase();
// 			return normalizedFirstLetter;
// 		}),
// 		(group) => group.length
// 	);

// 	return letterCounts;
// }

function splitBySearchGroup(strings) {
	const groupedStrings = groupBy(strings, (str) => getSearchGroupName(str));

	// If any letters from a-z are missing, fill them with empty arrays
	for (let l1 of 'abcdefghijklmnopqrstuvwxyz') {
		if (!Object.prototype.hasOwnProperty.call(groupedStrings, l1)) {
			groupedStrings[l1] = [];
		}
		for (let l2 of 'abcdefghijklmnopqrstuvwxyz') {
			const key = l1 + l2;
			if (!Object.prototype.hasOwnProperty.call(groupedStrings, key)) {
				groupedStrings[key] = [];
			}
		}
	}

	// Make sure items are alphabetically sorted
	for (const [key, content] of Object.entries(groupedStrings)) {
		groupedStrings[key] = content.sort();
	}
	return groupedStrings;
}

// function getSearchGroupName(string) {
// 	const normalizedFirstLetter = deburr(string.charAt(0)).toLowerCase();
// 	return /^[a-z]$/.test(normalizedFirstLetter) ? normalizedFirstLetter : 'other';
// }

function getSearchGroupName(string) {
	if (string.includes(SEPARATOR)) string = string.split(SEPARATOR)[0];

	const normalizedFirstTwoLetters = deburr(string.slice(0, 2)).toLowerCase().trim();
	const searchGroupName = /^[a-z]{1,2}$/.test(normalizedFirstTwoLetters)
		? normalizedFirstTwoLetters
		: 'other';
	return searchGroupName;
}

const files = fs.readdirSync(INPUT_PATH);
files.forEach(function (file) {
	const filePath = path.join(INPUT_PATH, file);
	if (path.extname(filePath).toLowerCase() === '.csv') {
		const parsedData = parseCSVFile(filePath);
		const preparedData = prepareData(parsedData);

		const folderName = file.replace('.csv', '');
		writeDataToFiles(folderName, preparedData);
		// const jsFileName = path.basename(file, '.csv') + 'json.';
		// const outputFile = path.join(OUTPUT_PATH, jsFileName);
		// console.log('Writing JSON to File...', jsFileName);
		// writeJSFile(outputFile, preparedData);
	}
});
