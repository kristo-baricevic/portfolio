// Define variables for the form and results div
const form = document.querySelector('#artistForm');
const resultsDiv = document.querySelector('#results');
const artistInput = document.querySelector('#artist');
artistInput.placeholder = 'Enter artist name';

async function getArtistId(artistName, token) {
  const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const searchData = await searchResponse.json();
  return searchData.artists.items[0].id;
}

async function getRecommendations(artistName) {
  try {
    // Request access token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa('22976e9ec0ac41229b1e0bf8b338f207' + ':' + '591f92133bcb400a8cbdce7db258fd3f')
      },
      body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    const token = data.access_token;

    // Get artist ID for the artist
    const artistId = await getArtistId(artistName, token);

    // Request recommendations based on artist ID
    const recommendationsResponse = await fetch(`https://api.spotify.com/v1/recommendations?seed_artists=${artistId}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const recommendationsData = await recommendationsResponse.json();

    // Display similar artists
    let artists = recommendationsData.tracks
      .map(track => track.artists[0].name)
      .filter(artist => artist.toLowerCase() !== artistName.toLowerCase());

    let artistsList = artists.map(artist => `<li class="artist-item">${artist}</li>`).join('');
    resultsDiv.innerHTML = `
      <h3>Similar artists to ${artistName}:</h3>
      <ul class="artists-list">${artistsList}</ul>
    `;
  } catch (error) {
    console.error(error);
  }
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const artistName = document.querySelector('#artist').value;
  getRecommendations(artistName);
}


// Event listener for form submission
form.addEventListener('submit', handleFormSubmit);
