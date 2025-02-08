import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const RateScreen = () => {
  const data = [
    {
      id: 1,
      name: 'Jin-Woo Purple',
      url: 'https://static.wikia.nocookie.net/topstrongest/images/c/c1/Jin-Woo_Purple.png/revision/latest?cb=20240421155002',
      type: 'image',
    },
    {
      id: 2,
      name: 'Another Image',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1YoqEn_01Xj0M3-52-iVaO9E4aChgUgRmpA&s',
      type: 'image',
    },
    {
      id: 3,
      name: 'Big Buck Bunny Video',
      url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      type: 'video',
    },
    {
      id: 4,
      name: 'Jin-Woo Purple (Copy)',
      url: 'https://static.wikia.nocookie.net/topstrongest/images/c/c1/Jin-Woo_Purple.png/revision/latest?cb=20240421155002',
      type: 'image',
    },
  ];

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer); // Stop the timer at 0
          console.log('⏰ Time is up!');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Decrement timer every second

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  const handleSwipeRight = (cardIndex) => {
    console.log(`✅ Liked: ${data[cardIndex].name}`);
  };

  const handleSwipeLeft = (cardIndex) => {
    console.log(`❌ Disliked: ${data[cardIndex].name}`);
  };

  return (
    <View style={styles.container}>
      {/* Timer slightly below the top */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          ⏳ Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </Text>
      </View>
      {/* Swiper */}
      <Swiper
        cards={data}
        renderCard={(item) => (
          <View style={styles.card}>
            {item.type === 'image' ? (
              <>
                <Image source={{ uri: item.url }} style={styles.image} />
                <Text style={styles.caption}>{item.name || 'No Name'}</Text>
              </>
            ) : (
              <Text style={styles.text}>Video Placeholder</Text>
            )}
          </View>
        )}
        onSwipedRight={handleSwipeRight}
        onSwipedLeft={handleSwipeLeft}
        onSwipedAll={() => {
          console.log('🔥 All cards swiped!');
        }}
        cardIndex={0}
        backgroundColor={'#000000'} // Black background for the swiper
        stackSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
    justifyContent: 'flex-start', // Ensure components align from the top
  },
  timerContainer: {
    position: 'absolute', // Position it above the swiper
    top: height * 0.05, // Slightly lower from the top
    width: '100%', // Full width
    alignItems: 'center',
    zIndex: 10, // Ensure it stays on top
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    width: width * 0.85,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#000', // Black background for the card
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '75%', // Adjusted to fit caption
    resizeMode: 'contain', // Ensures proper image scaling
  },
  caption: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});

export default RateScreen;



