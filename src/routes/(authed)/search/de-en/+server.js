import { json } from '@sveltejs/kit';
// import dictionaryData from "$lib/dictionaries/optimized/de-en.js"

const optimizedFilesURLs = import.meta.glob('/src/lib/dictionaries/optimized/*.json', { as: 'url' }); //*/

export function GET() {
	
	// const number = Math.floor(Math.random() * 6) + 1;
	// console.log("Dictionary data", dictionaryData)
	// console.log("🚀 ~ allFiles:", optimizedFilesURLs);

	const stringsArray = Object.values(optimizedFilesURLs).map(obj => obj.name);
	return json(stringsArray);
}
