console.log("Delete this lines to use")
process.exit(0)

// Common words optimized to maximize unique movie matches when searching
// Each word is selected to potentially match different sets of movies
const commonMovieWords = [
    // Action/Adventure terms
    "mission", "warrior", "legend", "dragon", "empire",
    // Drama/Emotional terms 
    "love", "heart", "dream", "soul", "destiny",
    // Horror/Thriller terms
    "night", "dark", "dead", "ghost", "blood",
    // Sci-fi/Fantasy terms
    "star", "world", "space", "future", "magic",
    // Time/Period terms
    "forever", "eternal", "last", "first", "final",
    // Location/Setting terms
    "city", "house", "kingdom", "paradise", "castle",
    // Color/Visual terms
    "black", "red", "blue", "golden", "silver",
    // Status/Quality terms
    "lost", "secret", "hidden", "perfect", "ultimate",
    // Movement/Action terms
    "rise", "fall", "return", "escape", "journey",
    // Size/Scale terms
    "great", "little", "big", "endless", "infinite"
];

const API_KEY = "REDACTED";

interface MovieSearchResponse {
    [key: string]: any;
}

async function searchMoviesByKeyword(keyword: string, page: number = 1): Promise<MovieSearchResponse> {
    const url = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword";
    
    const headers = {
        "accept": "application/json",
        "X-API-KEY": API_KEY
    };
    
    const params = {
        keyword,
        page: page.toString()
    };

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${queryString}`, { headers });
    return response.json();
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAllMovies() {
    const allMovies: MovieSearchResponse[] = [];
    const fs = require('fs');
    const path = require('path');

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    for (const word of commonMovieWords) {
        try {
            const response = await searchMoviesByKeyword(word);
            allMovies.push(response);
            
            // Sleep for 1 second between requests to avoid rate limiting
            await sleep(1000);
            
            console.log(`Successfully fetched movies for keyword: ${word}`);
        } catch (error) {
            console.error(`Error fetching movies for keyword ${word}:`, error);
            
            // If we hit an error, wait longer before retrying
            console.log('Waiting 5 seconds before continuing...');
            await sleep(5000);
        }
    }

    // Write results to file
    const filePath = path.join(dataDir, 'films.json');
    fs.writeFileSync(filePath, JSON.stringify(allMovies, null, 2));
    console.log('All movie data has been written to films.json');
}

// Execute the function
getAllMovies().catch(console.error);

