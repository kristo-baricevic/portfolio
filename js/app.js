// Define variables for the form and results div
const form = document.querySelector('#songForm');
const resultsDiv = document.querySelector('#results');

//get track
async function getTrackId(songName, token) {
  const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track&limit=1`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const searchData = await searchResponse.json();
  return searchData.tracks.items[0].id;
}

async function getRecommendations(songName) {
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

    // Get track ID for the song
    const trackId = await getTrackId(songName, token);

    // Request recommendations based on track ID
    const recommendationsResponse = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const recommendationsData = await recommendationsResponse.json();

    // Display recommended artists
    let artists = recommendationsData.tracks.map(track => track.artists[0].name);
    resultsDiv.innerHTML = `<p>Recommended artists based on ${songName}: ${artists.join(', ')}</p>`;
  } catch (error) {
    console.error(error);
  }
}


// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    const songName = document.querySelector('#song').value;
    getRecommendations(songName);
    }

// Event listener for form submission
form.addEventListener('submit', handleFormSubmit);
