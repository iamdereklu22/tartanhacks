import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as databaseRef, set } from "firebase/database";
import { storage, database } from "./firebase";
import * as Location from "expo-location";

const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const uploadImage = async (uri, location) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `images/${Date.now()}.jpg`;
      const imageRef = storageRef(storage, filename);

      const uploadTask = uploadBytesResumable(imageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            saveToDatabase(downloadURL, location);
          });
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const saveToDatabase = (downloadURL, location) => {
    const postId = Date.now().toString();
    const postRef = databaseRef(database, 'posts/' + postId);
    set(postRef, {
      imageUrl: downloadURL,
      likes: 0,
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
    }).then(() => {
      console.log('Post saved successfully!');
    }).catch((error) => {
      console.error('Error saving post:', error);
    });
  };