import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  logo: { width: 102, height: 162, margin: width / 20, right: width / 60 },
  button: {
    alignItems: "center",
    paddingHorizontal: width / 20,
    paddingVertical: height / 80
  },
  greetingText: { fontSize: 18, textAlign: "center" }
});

const Welcome = ({ handlePress }) => (
  <View style={styles.container}>
    <Text style={styles.greetingText}>
      Sign in to your Spotify to view information about your currently playing song.
    </Text>
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
    </TouchableOpacity>
  </View>
);

export default Welcome;
