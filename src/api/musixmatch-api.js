import { MUSIXMATCH_ENDPOINT, API_KEY } from "../constants/musixmatch";

const getSongLyrics = async ({ song, artist }) => {
  const URL = `${MUSIXMATCH_ENDPOINT}track.search?apikey=${API_KEY}&q_track=${song.toLowerCase()}&q_artist=${artist.toLowerCase()}`;
  try {
    let data = await fetch(URL);
    data = await data.json();
    let result;

    if (data.message.body.track_list.length > 0) {
      const item = data.message.body.track_list[0].track;
      const { track_id: trackId, artist_name: artistName, track_name: trackName } = item;

      const isSameSong =
        song.toLowerCase() === trackName.toLowerCase() && artistName.toLowerCase() === artist.toLowerCase();
      if (isSameSong) {
        const LYRICS_URL = `${MUSIXMATCH_ENDPOINT}track.lyrics.get?apikey=${API_KEY}&track_id=${trackId}`;
        result = await fetch(LYRICS_URL);
        result = await result.json();

        if (result.message.header.status_code === 404) {
          result = "No lyrics found.";
        } else {
          result = result.message.body.lyrics.lyrics_body;
        }
      } else {
        result = "No lyrics found.";
      }
    } else {
      result = "No lyrics found.";
    }
    return result;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default getSongLyrics;
