import * as fs from 'fs';
import * as path from 'path';

// Read films.json file
const filmsData = fs.readFileSync(path.join(__dirname, './data/films.json'), 'utf8');
const data = JSON.parse(filmsData);

// Count films in each keyword result
let totalFilms = 0;
for (const keywordData of data) {
  if (keywordData.films) {
    totalFilms += keywordData.films.length;
  }
}

console.log(`Total number of films: ${totalFilms}`);
