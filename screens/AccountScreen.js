import React, { useState, useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, Text, View, Switch, Image, Animated, FlatList } from "react-native";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API, API_WHOAMI } from "../constants/API";
import { useDispatch, useSelector } from "react-redux";
import { changeModeAction, deletePicAction, lightModeAction, darkModeAction } from '../redux/ducks/accountPref';
import { logOutAction, removeLoginAction, updateLoginAction } from "../redux/ducks/blogAuth";
import { List, Card, Paragraph, Title } from 'react-native-paper';

export default function AccountScreen({ navigation }) {

  const [username, setUsername] = useState("");
  const [displayname, setdisplayname] = useState("");

  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const loginuser = useSelector((state) => state.auth.loginuser);
  const loginname = useSelector((state) => state.auth.loginname);
  const is_coach = useSelector((state) => state.auth.is_coach);
  const profilePicture = useSelector((state) => state.accountPrefs.profilePicture);
  const userphoneno = useSelector((state) => state.auth.uphoneno);
  const dispatch = useDispatch();
  const [coaches, setCoaches] = useState([]);
  //const picSize = new Animated.Value(200);
  const picSize = new Animated.Value(0);

  const sizeInterpolation = {
    inputRange: [0, 0.5, 1],
    outputRange: [200, 300, 200]
  }  

/*  function changePicSize(){
    Animated.spring(picSize, {
      toValue: 300,
      duration: 2500,
      useNativeDriver: false
    }).start()
  }
  */
 /* function changePicSize(){
    Animated.loop(
      Animated.sequence([
        Animated.timing(picSize, {
        toValue: 300,
        duration: 2500,
        useNativeDriver: false
      }),
        Animated.timing(picSize, {
        toValue: 200,
        duration: 2500,
        useNativeDriver: false
      })
      ])
    ).start()
  }
  */
  function changePicSize() {
    Animated.loop(
      Animated.timing(picSize, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false
      }),
    ).start()
  }

  function deletePhoto() {
    dispatch(deletePicAction())
    navigation.navigate("Camera")
  }

  async function getUsername() {
    console.log("---- Getting user name ----");
    //const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
      setdisplayname(response.data.displayname);
    } catch (error) {
      console.log("Error getting user name");
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignInSignUp")
        }
      } else {
        console.log(error);
      }
      // We should probably go back to the login screen???
    }
  }

  function signOut() {
    dispatch(logOutAction());
    dispatch(removeLoginAction());
    //navigation.navigate("SignInSignUp");
    navigation.replace("SignInSignUp");
  }

  function switchMode() {
    dispatch(changeModeAction())
    console.log("switch ==", isDark)
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      if (is_coach) { getClient() } else getCoach();
    });
    if (is_coach) { getClient() } else getCoach();
    return removeListener;
  }, []);

  useEffect(() => {
    console.log("act useeffect", profilePicture);

  }, []);

  async function getCoach() {
    // console.log("at getselected token=", token); //const token = await AsyncStorage.getItem("token");
    // console.log("loc=", loc);
    try {
      const response = await axios.get('https://LHT2021.pythonanywhere.com/coachbook/' + loginuser);
      console.log("coach response", loginuser, response.data);
      //console.log(token);
      //setPosts(response.data);
      setCoaches(response.data);
      //setUsername(response.data.username);
      // return "completed"
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.error = "Invalid token") {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  async function getClient() {
    // console.log("at getselected token=", token); //const token = await AsyncStorage.getItem("token");
    // console.log("loc=", loc);
    try {
      const response = await axios.get('https://LHT2021.pythonanywhere.com/coachbook2/' + loginuser);
      console.log("client response", loginuser, response.data);
      //console.log(token);
      //setPosts(response.data);
      setCoaches(response.data);
      //setUsername(response.data.username);
      // return "completed"
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.error = "Invalid token") {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  function renderbook({item }) {
    return (
      <View
        style={{
          padding: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {(!is_coach) ? <Text style={styles.text}> {item.coachName2}, experience: {item.coachExperience}, 
            fee: ${item.fee}, location: {item.location} </Text>  :  
                       <Text style={styles.text}> {item.userName2}, level: {item.level}, 
            fee: ${item.fee}, location: {item.location} </Text>}

        <Text style={{color: "brown"}}>Phone: {item.phoneno}</Text>
        {coaches === null  ? <Text style={{ fontSize: 30, color: "red"}}>You have no Booking yet ...</Text> : <Text></Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={{ fontSize: 30, color: "#0000EE", marginTop : 30 }}>
        {" "}
        Nice to see you! {loginname}{" "}
      </Text>
      <Text></Text>
      <Text style={{ fontSize: 25, color: "brown", marginTop : 100 }}>Your Booking : </Text>
      {/* <Card style={styles.card}>
        <Card.Cover
          style={{ marginTop: 10, width: 200, height: 200 }}
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg",
          }}
        />
      </Card> */}
      {/* <View style={{height: profilePicture == null ? 0 : 320, justifyContent: "center"}}>
      {profilePicture == null ? <View /> :
        <TouchableWithoutFeedback onPress={changePicSize}>
          <Animated.Image style={{ width: picSize.interpolate(sizeInterpolation), height: picSize.interpolate(sizeInterpolation), borderRadius: 200 }} source={{ uri: profilePicture?.uri }} />
        </TouchableWithoutFeedback>
      }
      </View>
          <TouchableOpacity onPress={() => profilePicture == null ? navigation.navigate("Camera") : deletePhoto()}>
          <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 20, color: "#0000EE" }}> { profilePicture == null ? "No profile picture. Click to take one." : "Delete this photo and take another one."} </Text>
          </TouchableOpacity> */}

      <Text> </Text>
      <Text> </Text>
      <View style={styles.container}>
        <FlatList
          data={coaches}
          renderItem={renderbook}
          style={{ width: "100%" }}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <TouchableOpacity style={[styles.button]} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
// uri: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg",
// {coaches} == null  ? <Text>Null</Text> : <Text>Not Null</Text>