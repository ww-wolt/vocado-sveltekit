import { json, error } from '@sveltejs/kit';
import deburr from 'lodash/deburr';
import fuzzysort from 'fuzzysort';

const SEPARATOR = '֍';

// import dictionaryData from "$lib/dictionaries/optimized/de-en.js"

// const optimizedFilesURLs = import.meta.glob('/src/lib/dictionaries/optimized/*.txt', { as: 'url' }); //*/

export async function GET({ url, fetch }) {
	console.log('🚀 ~ GET ~ fetch:', fetch);
	const query = url.searchParams.get('query');
	const baseLanguage = url.searchParams.get('baseLanguage');
	const foreignLanguage = url.searchParams.get('foreignLanguage');

	const searchGroup = getSearchGroupName(query);
	const suggestionsURL = `/dictionaries/optimized/${searchGroup}.txt`;

	try {
		const fetchTimer = startTimer();
		const res = await fetch(suggestionsURL);

		if (!res.ok) {
			throw new Error(`Response error ${res.status}: ${res.statusText}`);
		}

		const rawText = await res.text();
		const fetchTime = fetchTimer();

		const prepareTimer = startTimer();
		const preparedData = prepareFuzzysort(rawText);
		const prepareTime = prepareTimer();

		const searchTimer = startTimer();
		const searchResults = searchFuzzysort(query, preparedData);
		const searchTime = searchTimer();

		return json({ fetchTime, prepareTime, searchTime, suggestions: searchResults });
	} catch (error) {
		return json({ error: 'An unexpected error occurred while fetching data.' }, { status: 500 });
	}

	// return json({ query, baseLanguage, foreignLanguage, searchGroup });
	// try {
	// 	const stringsArray = Object.values(optimizedFilesURLs).map((obj) => obj.name);
	// 	const response = await fetch(stringsArray[0]);
	// 	if (!response.ok) {
	// 		throw new Error('Network response was not ok');
	// 	}
	// 	const text = await response.text();
	// 	console.log('🚀 ~ GET ~ text:', text);
	// 	// const lines = text.split('\n');
	// 	return text;
	// } catch (error) {
	// 	console.log('Error downloading data');
	// }
	// const number = Math.floor(Math.random() * 6) + 1;
	// console.log("Dictionary data", dictionaryData)
	// console.log("🚀 ~ allFiles:", optimizedFilesURLs);
	// const stringsArray = Object.values(optimizedFilesURLs).map((obj) => obj.name);
	// console.log('🚀 ~ GET ~ optimizedFilesURLs:', optimizedFilesURLs);
	// return json(stringsArray);
}

function getSearchGroupName(string) {
	const normalizedFirstLetter = deburr(string.charAt(0)).toLowerCase();
	return /^[a-z]$/.test(normalizedFirstLetter) ? normalizedFirstLetter : 'other';
}

function prepareFuzzysort(rawText) {
	console.time('Prepare Fuzzysort');

	let array = [];
	const lines = rawText.split('\n');
	lines.forEach((line) => {
		const [word, language] = line.split(SEPARATOR);
		// array.push({ s: fuzzysort.prepare(word), l: language });
		array.push({ s: word, l: language });
	});
	console.timeEnd('Prepare Fuzzysort');

	return array;
}

function searchFuzzysort(query, preparedData) {
	console.time('Search Fuzzysort');
	const searchResults = fuzzysort
		.go(query, preparedData, {
			key: 's',
			limit: 100,
			threshold: -10000
		})
		.map((result) => {
			return { word: result.target, language: result.obj.l, score: result.score };
		});
	console.timeEnd('Search Fuzzysort');
	return searchResults;
}

function startTimer() {
	const startTime = process.hrtime();
	return function endTimer() {
		const endTime = process.hrtime(startTime);
		const measuredTime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
		return measuredTime.toFixed(2) + 'ms';
	};
}
