import { json, error } from '@sveltejs/kit';
import deburr from 'lodash/deburr';
import fuzzysort from 'fuzzysort';

const SEPARATOR = '֍';
let preparedCache = {};

// import dictionaryData from "$lib/dictionaries/optimized/de-en.js"

// const optimizedFilesURLs = import.meta.glob('/src/lib/dictionaries/optimized/*.txt', { as: 'url' }); //*/

export async function GET({ url, fetch }) {
	const query = url.searchParams.get('query');
	const baseLanguage = url.searchParams.get('baseLanguage');
	const foreignLanguage = url.searchParams.get('foreignLanguage');

	const searchGroup = getSearchGroupName(query);

	try {
		let fetchTime = 'Cache';
		let prepareTime = 'Cache';

		let preparedData = preparedCache[searchGroup];

		// Fetch & prepare if data not in cache
		if (!preparedData) {
			const fetchTimer = startTimer();
			const rawText = await fetchData(fetch, searchGroup);
			fetchTime = fetchTimer();

			const prepareTimer = startTimer();
			preparedData = prepareFuzzysort(rawText);
			preparedCache[searchGroup] = preparedData;
			prepareTime = prepareTimer();
		}

		const searchTimer = startTimer();
		const searchResults = searchFuzzysort(query, preparedData);
		const searchTime = searchTimer();

		return json({ fetchTime, prepareTime, searchTime, suggestions: searchResults });
	} catch (error) {
		return json(
			{ error: 'An unexpected error occurred while searching suggestions.' },
			{ status: 500 }
		);
	}
}

async function fetchData(fetch, searchGroup) {
	const suggestionsURL = `/dictionaries/optimized/${searchGroup}.txt`;
	const res = await fetch(suggestionsURL);
	if (!res.ok) {
		throw new Error(`Response error ${res.status}: ${res.statusText}`);
	}
	const rawText = await res.text();
	return rawText;
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
		array.push({ d: fuzzysort.prepare(deburr(word)), w: word, l: language });
	});
	console.timeEnd('Prepare Fuzzysort');

	return array;
}

function searchFuzzysort(query, preparedData) {
	console.time('Search Fuzzysort');
	const searchResults = fuzzysort
		.go(deburr(query), preparedData, {
			key: 'd',
			limit: 100,
			threshold: -10000
		})
		.map((result) => {
			return { word: result.obj.w, language: result.obj.l, score: result.score };
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
