import React from "react";
import { StyleSheet, Text, View, AsyncStorage, ActivityIndicator } from "react-native";
import { AuthSession } from "expo";
import Sentry from "sentry-expo";
import URL from "./src/constants/auth";
import { getUserInfo, getCurrentlyPlaying, getSongStats } from "./src/api/spotify-api";
import getAnnotations from "./src/api/genius-api";
import getSongLyrics from "./src/api/musixmatch-api";
import Welcome from "./src/components/welcome";
import Results from "./src/components/results";
import { sleep, convertMillisToMinsSecs } from "./src/constants/utils";

Sentry.config("https://6d5fe4a8e80740999812882112be4afd@sentry.io/1299270").install();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  errorText: { color: "red", fontSize: 18, paddingHorizontal: 20, textAlign: "center" }
});

export default class App extends React.Component {
  state = { data: null, loading: true, token: null };
  async componentDidMount() {
    await this.getTokenFromStorage();
  }
  getTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      this.setState({ token });
      if (token) {
        this.fetchUserData(token);
      } else {
        this.setState({ loading: false });
      }
    } catch (e) {
      this.setState({ error: "An Error has occurred. Please try again later.", loading: false });
    }
  };
  authIn = async () => {
    const redirectUrl = AuthSession.getRedirectUrl();

    try {
      const result = await AuthSession.startAsync({
        authUrl: `${URL}&redirect_uri=${encodeURIComponent(redirectUrl)}`
      });

      if (result.params.access_token) {
        const { access_token: accessToken } = result.params;
        await AsyncStorage.removeItem("ACCESS_TOKEN");
        await AsyncStorage.setItem("ACCESS_TOKEN", accessToken);
        this.setState({ token: accessToken });
        this.fetchUserData(accessToken);
      }
    } catch (e) {
      this.setState({ error: "An Error has occurred. Please try again later.", loading: false });
    }
  };
  fetchUserData = async token => {
    try {
      const { data } = await getUserInfo({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.setState({ data, loading: false });

      if (data.isPlaying) {
        this.fetchSongInfo(data.id, token);
      }
      this.pollPlaying();
    } catch (e) {
      if (e.message === "401") {
        await AsyncStorage.removeItem("ACCESS_TOKEN");
      }
      this.setState({ error: "An Error has occurred. Please try again later.", loading: false });
    }
  };
  fetchSongInfo = async (id, token) => {
    try {
      const info = await getSongStats(id, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.setState({ info });
      this.fetchAnnotations();
    } catch (e) {
      this.setState({ error: "An Error has occurred. Please try again later.", loading: false });
    }
  };
  fetchAnnotations = async () => {
    try {
      const { data } = this.state;
      const { annot: annotations } = await getAnnotations({
        song: data.song.toLowerCase(),
        artist: data.artist.toLowerCase()
      });
      this.setState({ annotations });
      this.fetchLyrics();
    } catch (e) {
      this.setState({ error: "An Error has occurred. Please try again later." });
    }
  };
  fetchLyrics = async () => {
    try {
      const { data } = this.state;
      const lyrics = await getSongLyrics({
        song: data.song.toLowerCase(),
        artist: data.artist.toLowerCase()
      });
      this.setState({ lyrics });
    } catch (e) {
      this.setState({ error: "An Error has occurred. Please try again later." });
    }
  };
  pollPlaying = async () => {
    while (true) {
      try {
        const { token, data } = this.state;
        const result = await getCurrentlyPlaying({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const res = {
          id: result.is_playing ? result.item.id : "",
          song: result.item.name,
          isPlaying: result.is_playing,
          artist: result.item.artists[0].name,
          duration: convertMillisToMinsSecs(result.item.duration_ms),
          name: data.name
        };

        if (data.id !== result.item.id && result.is_playing) {
          this.setState({ data: res, info: null, lyrics: null, annotations: null });
          this.fetchSongInfo(result.item.id, token);
          this.fetchAnnotations();
          this.fetchLyrics();
        } else if (!result.is_playing) {
          this.setState({ data: res, info: null, lyrics: null, annotations: null });
        }
      } catch (e) {
        this.setState({ error: "An Error has occurred. Please try again later." });
      }
      await sleep(5000);
    }
  };
  render() {
    const { data, error, token, info, loading, annotations, lyrics } = this.state;

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!token || !data) {
      return <Welcome handlePress={this.authIn} />;
    }

    return <Results data={data} songInfo={info} annotations={annotations} lyrics={lyrics} />;
  }
}
