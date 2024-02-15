<script>
	import '../app.pcss';
	import { onMount } from 'svelte';
	import Papa from 'papaparse';
	import axios from 'axios';
	import { page } from '$app/stores';
	import fuzzysort from 'fuzzysort';
	import uFuzzy from '@leeoniya/ufuzzy';

	onMount(async () => {
		downloadDictionary();
		console.log('hello');
		// window.onload = function () {
		// 	console.log('Page finished loading');
		// };
		document.body.addEventListener('load', (event) => {
			console.log('page is fully loaded');
		});
	});

	async function downloadDictionary() {
		try {
			console.log('Start downloading dictionary');
			const response = await fetch('/dictionaries/de-en.csv', { priority: 'low' });
			const blob = await response.blob();
			console.log('Finished downloading dictionary');
			Papa.parse(blob, {
				header: true,
				worker: true,
				complete: function (results) {
					console.log('Parsed dictionary');

					const stringArray = [];

					results.data.forEach((obj) => {
						stringArray.push(obj.de);
						stringArray.push(obj.en);
					});
					// console.log('🚀 ~ downloadDictionary ~ stringArray:', stringArray);

					const searchString = 'sala';
					// uFuzzySearch2(searchString, stringArray);

					searchFuzzysort(searchString, prepareFuzzysortData(results.data));
					searchFuzzysort2(searchString, prepareFuzzysortData2(stringArray));
				}
			});
		} catch (error) {
			console.error('Error downloading dictionary:', error);
		}
	}

	function prepareFuzzysortData(data) {
		console.log('Fuzzysort: Start prepare');

		const array = [];

		data.forEach((obj) => {
			array.push({ str: fuzzysort.prepare(obj.de), language: 'de' });
			array.push({ str: fuzzysort.prepare(obj.en), language: 'en' });
		});
		// console.log("🚀 ~ prepareFuzzysortData ~ array:", array);
		console.log('Fuzzysort: End prepare');
		return array;
	}

	function prepareFuzzysortData2(data) {
		console.log('Fuzzysort2: Start prepare');
		const prepared = data.map((str) => fuzzysort.prepare(str));
		console.log('Fuzzysort2: End prepare');
		return prepared;
	}

	function searchFuzzysort(searchString, data) {
		// console.log('Fuzzysort: Start search');
		console.time('Fuzzysort1');
		const searchResults = fuzzysort.go(searchString, data, {
			key: 'str',
			limit: 100,
			threshold: -10000
		});
		// console.log('Fuzzysort: End search');
		console.timeEnd('Fuzzysort1');
		console.log('Fuzzysort: Results', searchResults);
		return searchResults;
	}

	function searchFuzzysort2(searchString, data) {
		// console.log('Fuzzysort2: Start search');
		console.time('Fuzzysort2');

		const searchResults = fuzzysort.go(searchString, data, {
			limit: 100,
			threshold: -10000
		});
		// console.log('Fuzzysort2: End search');
		console.timeEnd('Fuzzysort2');
		console.log('Fuzzysort2: Results', searchResults);
		return searchResults;
	}

	function uFuzzySearch(searchString, data) {
		console.log('uFuzzy: Start search');

		let uf = new uFuzzy({
			intraMode: 1
		});
		const results = uf.search(data, searchString);
		console.log('uFuzzy: End search');
		console.log('uFuzzy: Results', results);
	}

	function uFuzzySearch2(searchString, data) {
		// console.log('uFuzzy: Start search');
		console.time('uFuzzy');

		// Options for the uFuzzy instance
		let opts = {
			intraMode: 1 // Specify the intraMode option
		};

		// Create a new uFuzzy instance with the specified options
		let u = new uFuzzy(opts);

		// Filter the game titles based on the search term
		let idxs = u.filter(data, searchString);

		// Get additional information about the filtered indices
		let info = u.info(idxs, data, searchString);

		// Sort the information based on fuzzy match scores
		let order = u.sort(info, data, searchString);

		// Array to store uFuzzy results (ordered matches)
		let uFuzzyResults = [];

		// Iterate through the ordered matches and push them to uFuzzyResults
		for (let i = 0; i < Math.min(order.length, 100); i++) {
			// Using info.idx here instead of idxs because uf.info() may have
			// further reduced the initial idxs based on prefix/suffix rules
			uFuzzyResults.push(data[info.idx[order[i]]]);
		}
		// console.log('uFuzzy: End search');
		console.timeEnd('uFuzzy');
		console.log('uFuzzy: Results', uFuzzyResults);

		return uFuzzyResults;
	}

	async function downloadDictionaryAxios() {
		console.log('Start downloading dictionary');
		axios
			.get('/dictionary-de-en.csv', {
				onDownloadProgress: (progressEvent) => {
					let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					console.log('% done-> ', percentCompleted);
				}
			})
			.then((response) => {
				console.log('Finished downloading dictionary');
				console.log(response);
				Papa.parse(response.data, {
					header: true,
					worker: true,
					complete: function (results) {
						console.log('Parsed dictionary', results);
					}
				});
			})
			.catch((error) => {
				console.error('Axios Error downloading dictionary:', error);
			});
	}
</script>

<!-- App Wrapper -->
<div id="app" class="mx-auto flex max-w-lg flex-col items-center">
	<slot />
</div>

<svelte:head>
	<title>Vocado</title>
</svelte:head>

<style>
</style>
