import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [prompt, setPrompt] = useState("Loading...");
  const slideAnim = new Animated.Value(0);
  const [initialRegion, setInitialRegion] = useState(null);
  const [mapError, setMapError] = useState(null);

  const cyberpunkStyle = [
    { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#222" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#c4c3ff" }] },
    { featureType: "water", stylers: [{ color: "#0f3460" }] },
    { featureType: "road", stylers: [{ color: "#ff4b5c" }] },
    { featureType: "poi", stylers: [{ color: "#f7b733" }] },
  ];

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permission to access location was denied");
          // Set default region (world view) if permission denied
          setInitialRegion({
            latitude: 0,
            longitude: 0,
            latitudeDelta: 150,
            longitudeDelta: 150,
          });
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low, // Lower accuracy for faster response
        });

        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 150,
          longitudeDelta: 150,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        setMapError(error.message);
        // Set default region on error
        setInitialRegion({
          latitude: 0,
          longitude: 0,
          latitudeDelta: 150,
          longitudeDelta: 150,
        });
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + "prompt.txt";
        const content = await FileSystem.readAsStringAsync(fileUri);
        setPrompt(content);
      } catch (error) {
        console.warn("Error reading prompt:", error);
        setPrompt("Default Prompt");
      }
    };
    loadPrompt();
  }, []);

  const handleRecord = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => navigation.navigate("RecordScreen"));
  };

  const handleRate = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => navigation.navigate("RateScreen"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.promptBar}>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>

      <View style={styles.mapContainer}>
        {mapError ? (
          <Text style={styles.errorText}>Error loading map: {mapError}</Text>
        ) : (
          initialRegion && (
    
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              customMapStyle={cyberpunkStyle} // Your custom colors
              provider={null} // Force Google Maps
            />
          )
        )}
      </View>

      <TouchableOpacity style={styles.cameraButton} onPress={handleRecord}>
        <MaterialIcons name="videocam" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  mapContainer: {
    flex: 1,
    marginTop: 120,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width - 32,
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  promptBar: {
    position: "absolute",
    top: 135,
    width: "80%",
    height: 50,
    alignSelf: "center",
    backgroundColor: "lightgray",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  promptText: {
    fontSize: 18,
    color: "black",
  },
  cameraButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#FF4757",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rateButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "#FF4757",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 30,
  },
  errorText: {
    color: "#FF4757",
    fontSize: 16,
    textAlign: "center",
  },
});
