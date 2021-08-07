import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
//import { darkStyles, lightStyles } from '../styles/commonStyles';
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import { useDispatch, useSelector } from 'react-redux';
import { uploadPicAction } from '../redux/ducks/accountPref';
import axios from "axios";
import { API, API_PHOTO } from "../constants/API";

export default function CameraScreen({ navigation }) {

  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = isDark ? darkStyles : lightStyles
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(null);
  const [back, setBack] = useState(true)
  const cameraRef = useRef(null)

  async function showCamera() {
    const {status} = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (hasPermission === false) {
      Alert.alert("Error: No access given")
    }
  }

  function flip() {
    setBack(!back)
  }

  async function takePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    console.log(photo);
    dispatch({ ...dispatch(uploadPicAction()), payload: photo});
    //sendPicture(photo);
    navigation.navigate("Account")
  }

  async function sendPicture(photo) {
    try {
      console.log("send picture");
      const response = await axios.post(API + API_PHOTO, photo, {
        headers: { 'content-type': 'multipart/form-data' }
      });
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={flip}>
          <FontAwesome name="refresh" size={24} style={{ color: styles.headerTint, marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    showCamera()
  }, [])

  return (
    <View style={{flex: 1}}>
      <Camera style={additionalStyles.camera}
        type={back ? Camera.Constants.Type.back : Camera.Constants.Type.front} ref={cameraRef}>
        <View style={additionalStyles.innerView}>
          <View style={additionalStyles.buttonView}>
            <TouchableOpacity onPress={takePicture}
              style={[additionalStyles.circleButton, { backgroundColor: isDark ? "black" : "white" }]} />
          </View>
        </View>
      </Camera>
    </View>
  )
}

  const additionalStyles = StyleSheet.create({
    camera: {
      flex: 1,
    },
      circle: {
      height: 50,
      width: 50,
      borderRadius: 50,
    },
    circleButton: {
      width: 70,
      height: 70,
      bottom: 0,
      borderRadius: 50,
    },
    buttonView: {
      alignSelf: 'center',
      flex: 1,
      alignItems: 'center'
    },
    innerView: {
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      padding: 20,
      justifyContent: 'space-between'
    }
  })
