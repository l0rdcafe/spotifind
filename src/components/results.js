import React, { Fragment } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from "react-native";
import HTML from "react-native-render-html";

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: height / 10, alignItems: "center" },
  greetingText: { fontSize: 16, textAlign: "center", paddingHorizontal: width / 20 },
  username: { color: "#476dc5", fontWeight: "700" },
  song: { color: "#118f19", fontWeight: "700" },
  artist: { color: "#118f19", fontWeight: "700" },
  row: {
    flexDirection: "row",
    marginTop: height / 30,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#bbb"
  },
  rowItem: { flex: 1, fontSize: 10, textAlign: "center", height: height / 20 },
  stat: { color: "purple" },
  danceability: { height: 10, width: 10, borderRadius: 50 },
  loading: { marginTop: height / 30 },
  htmlContainer: { paddingHorizontal: width / 20, marginVertical: height / 40 },
  lyrics: {
    marginHorizontal: width / 20,
    paddingHorizontal: width / 20,
    paddingVertical: height / 50,
    flex: 1,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: height / 50
  },
  lyricsText: { fontSize: 14 }
});

const Results = ({ data, songInfo, annotations, lyrics }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.greetingText}>
        Welcome, <Text style={styles.username}>{data.name}</Text>.{" "}
        <Text>
          {data.isPlaying ? (
            <Fragment>
              You are currently listening to <Text style={styles.song}>{data.song}</Text> by{" "}
              <Text style={styles.artist}>{data.artist}.</Text>
            </Fragment>
          ) : (
            "You are currently not listening to anything. Please play a song on your Spotify to get more information."
          )}
        </Text>
      </Text>
    </View>
    {songInfo ? (
      <View style={styles.row}>
        <Text style={styles.rowItem}>
          Duration: <Text style={styles.stat}>{data.duration}</Text>
        </Text>
        <Text style={styles.rowItem}>
          Tempo: <Text style={styles.stat}>{songInfo[0]} BPM</Text>
        </Text>
        <Text style={styles.rowItem}>
          Key: <Text style={styles.stat}>{songInfo[1]}</Text>
        </Text>
        <Text style={styles.rowItem}>
          Danceability: <View style={[styles.danceability, { backgroundColor: songInfo[2] }]} />
        </Text>
      </View>
    ) : (
      data.isPlaying && <ActivityIndicator style={styles.loading} />
    )}
    {annotations ? (
      <ScrollView style={{ flex: 1 }}>
        <HTML
          html={annotations}
          imagesMaxWidth={width}
          containerStyle={styles.htmlContainer}
          baseFontStyle={{ fontSize: 14, textAlign: "center" }}
          textSelectable
          tagsStyles={{
            a: { color: "#476dc5", textDecorationLine: "none" },
            img: { maxWidth: width - width / 8 },
            iframe: { maxWidth: width - width / 8 }
          }}
        />
        {lyrics ? (
          <View style={styles.lyrics}>
            <Text style={styles.lyricsText}>{lyrics}</Text>
          </View>
        ) : (
          data.isPlaying && <ActivityIndicator style={styles.loading} />
        )}
      </ScrollView>
    ) : (
      data.isPlaying && <ActivityIndicator style={styles.loading} />
    )}
  </View>
);

export default Results;
