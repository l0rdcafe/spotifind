const CLIENT_ID = "f8df77a3e85c4e49b6e702e8be74f262";
const SCOPES = encodeURIComponent("user-read-currently-playing");
const URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=${SCOPES}`;

export default URL;
