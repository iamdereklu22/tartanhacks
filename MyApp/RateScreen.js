import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { useNavigation } from "@react-navigation/native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

const RateScreen = () => {
  const navigation = useNavigation();
  const slideAnim = new Animated.Value(0);
  const shakeAnim = useRef(new Animated.Value(0)).current; // Shake animation reference

  const data = [
    {
      id: 1,
      name: "Jin-Woo Purple",
      url: "https://static.wikia.nocookie.net/topstrongest/images/c/c1/Jin-Woo_Purple.png/revision/latest?cb=20240421155002",
      type: "image",
    },
    {
      id: 2,
      name: "Another Image",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1YoqEn_01Xj0M3-52-iVaO9E4aChgUgRmpA&s",
      type: "image",
    },
    {
      id: 3,
      name: "Big Buck Bunny Video",
      url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      type: "video",
    },
    {
      id: 4,
      name: "Jin-Woo Purple (Copy)",
      url: "https://static.wikia.nocookie.net/topstrongest/images/c/c1/Jin-Woo_Purple.png/revision/latest?cb=20240421155002",
      type: "image",
    },
  ];

  const handleTimeout = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => navigation.navigate("Home"));
  };

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer); // Stop the timer at 0
          console.log("⏰ Time is up!");
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Decrement timer every second

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  // Shake animation logic
  useEffect(() => {
    if (timeLeft === 10) {
      const startShake = () => {
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 5, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start(() => startShake()); // Loop shake animation
      };
      startShake();
    }
  }, [timeLeft]);

  const handleSwipeRight = (cardIndex) => {
    console.log(`✅ Liked: ${data[cardIndex].name}`);
  };

  const handleSwipeLeft = (cardIndex) => {
    console.log(`❌ Disliked: ${data[cardIndex].name}`);
  };

  return (
    <View style={styles.container}>
      {/* Timer slightly below the top with shake effect */}
      <Animated.View style={[styles.timerContainer, { transform: [{ translateX: shakeAnim }] }]}>
        <Text style={[styles.timerText, timeLeft <= 10 && styles.timerTextRed]}>
          ⏳ Time Left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </Text>
      </Animated.View>
      {/* Swiper */}
      <Swiper
        cards={data}
        renderCard={(item) => (
          <View style={styles.card}>
            {item.type === "image" ? (
              <>
                <Image source={{ uri: item.url }} style={styles.image} />
                <Text style={styles.caption}>{item.name || "No Name"}</Text>
              </>
            ) : (
              <Text style={styles.text}>Video Placeholder</Text>
            )}
          </View>
        )}
        onSwipedRight={handleSwipeRight} // ✅ Like
        onSwipedLeft={handleSwipeLeft} // ❌ Dislike
        onSwipedTop={(cardIndex) => {
          console.log(`⬆️ Swiped Up → Treated as Dislike: ${data[cardIndex].name}`);
          handleSwipeLeft(cardIndex); // Process as Dislike
        }}
        onSwipedBottom={(cardIndex) => {
          console.log(`⬇️ Swiped Down → Treated as Dislike: ${data[cardIndex].name}`);
          handleSwipeLeft(cardIndex); // Process as Dislike
        }}
        onSwipedAll={() => {
          console.log("🔥 All cards swiped!");
        }}
        cardIndex={0}
        backgroundColor={"#000000"} // Black background for the swiper
        stackSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
    justifyContent: "flex-start", // Ensure components align from the top
  },
  timerContainer: {
    position: "absolute", // Position it above the swiper
    top: height * 0.1, // 10% from the top
    width: "100%", // Full width
    alignItems: "center",
    zIndex: 10, // Ensure it stays on top
  },
  timerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  timerTextRed: {
    color: "red", // Turns red when time is <= 10
  },
  card: {
    width: width * 0.9, // Make the card slightly wider
    height: height * 0.8, // Increase card height
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#000", // Black background for the card
    marginHorizontal: 10,
    overflow: "hidden",
    paddingTop: 30, // Move content lower to avoid overlap with the timer
  },
  image: {
    width: "100%", // Full width of the card
    height: "80%", // Adjusted height (was 85%)
    resizeMode: "contain", // Ensures proper image scaling
    marginTop: 20, // Push the image lower inside the card
  },
  caption: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 15, // Keep proper spacing below the image
  },
});

export default RateScreen;
