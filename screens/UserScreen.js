import React, { useState, useEffect, Component } from "react";
import { StyleSheet, Alert, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import { API, API_COACHES, API_WHOAMI, API_NEWCOACH, API_COACHM } from "../constants/API";
import axios from "axios";
// import { useSelector } from "react-redux";
import {Picker} from '@react-native-picker/picker';
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { logOutAction, updateLoginAction, setCoachAction, updateNameAction, updateUserNoAction } from "../redux/ducks/blogAuth";

export default function UserScreen({ navigation }) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const loginuser = useSelector((state) => state.auth.loginuser);
  const loginname = useSelector((state) => state.auth.loginname);
  const is_coach = useSelector((state) => state.auth.is_coach);
  const userphoneno = useSelector((state) => state.auth.uphoneno);
  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };
  const [phone, setPhone] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [coaches, setCoaches] = useState("");
  const [userName, setUsername] = useState("");
  const [id, setId] = useState(0);
  const [displayname, setDisplayname] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
  //onst userphoneno = useSelector((state) => state.auth.uphoneno);
    console.log("seb",loginuser, userphoneno);
    getUsername();
    //loginuser = useSelector((state) => state.auth.loginuser);
  }, []);


  // useEffect(() => {
  //   console.log("Setting up coach listener");
  //   // Check for when we come back to this screen
  //   const removeListener = navigation.addListener("focus", () => {
  //     //console.log("Running coach listener");
  //     console.log(token);
  //     getCoaches();
  //   });
  //   getCoaches();
  //   return removeListener;
  // }, []);

  async function getSelected(loc) {
    // console.log("at getselected token=", token); //const token = await AsyncStorage.getItem("token");
    console.log("loc=", loc);
    try {
      const response = await axios.get(API + API_COACHM + loc);
      console.log("coach response", response.data);
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

  async function getUsername() {
    console.log("---- Getting user name (create) ----");
    //const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name userScreen!", response);
      // console.log("ht1",response.data.username, loginuser);
      dispatch({ ...setCoachAction(), payload: response.data.coach })
      dispatch({ ...updateNameAction(), payload: response.data.displayname })
      dispatch({ ...updateUserNoAction(), payload: response.data.phoneno })
      console.log("ht user",loginuser, "displayname", loginname, "coach", is_coach, "phone", userphoneno);
      getSelected(response.data.location);


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

  async function bookCoach(item) {
    console.log("u=",item);
    const coachM = {
      "phoneno": userphoneno,
      "level": item.level,
      "location": item.location,
      "coachExperience": item.experience,
      "userName": loginuser,
      "userName2": loginname,
      "coachName": item.username,
      "coachName2": item.displayname,
      "fee": item.fee
    }
    // const coachM = {
    //   "phoneno": phone,
    //   "level": level,
    //   "location": location,
    //   "experience": experience,
    //   "userName": userName,
    //   "userName2": "userName2",
    //   "coachName": displayname,
    //   "coachName2": "displayname2"
    // }
    console.log("bookcoach");
    try {
      console.log(token);
      const response = await axios.post(API + API_NEWCOACH, coachM, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log(response.data)
      navigation.navigate("Booking")
    } catch (error) {
      console.log(error)
    }
  }

  function renderItem({ item }) {
    return (
      // <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>
      //   <View
      //     style={{
      //       padding: 10,
      //       paddingTop: 20,
      //       paddingBottom: 20,
      //       borderBottomColor: "#ccc",
      //       borderBottomWidth: 1,
      //       flexDirection: "row",
      //       justifyContent: "space-between",
      //     }}>
      //     <Text style={styles.text}>{item.displayname}, skill level: {item.experience}, fee: ${item.fee}</Text>
      <View
        style={{
          padding: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        {is_coach ? <Text> Sorry, this page is pending development, please view other pages </Text> : <Text style={styles.text}>{item.displayname}, skill level: {item.experience}, fee: ${item.fee}</Text>}
        {!is_coach ? <TouchableOpacity onPress={() => { bookCoach(item) }}>
           <Entypo name="open-book" size={20} color="#a80000" /> 
        </TouchableOpacity>  : <Text></Text>}
      
      </View>
      // </TouchableOpacity>
    );
  }

  const showAlert = () =>
  Alert.alert(
    "Alert Title",
    "My Alert Msg",
    [
      {
        text: "Cancel",
        onPress: () => Alert.alert("Cancel Pressed"),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          "This alert was dismissed by tapping outside of the alert dialog."
        ),
    }
  );


  return (
    <View style={styles.container}>
      {!is_coach ? <FlatList data={coaches} renderItem={renderItem} style={{ width: "100%" }} 
          keyExtractor={(item) => item.id.toString()} /> :
           <Image style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}  source={require('../assets/swim.jpg')} /> }
    </View>
  );
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 15,
  },
  label: {
    fontSize: 28,
    marginBottom: 10,
    marginLeft: 5
  }
});
/*
        <Text style={[additionalStyles.label, styles.text]}>Level</Text>
        <TextInput
          style={additionalStyles.input}
          value={level}
          onChangeText={text => setLevel(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Coach experience</Text>
        <TextInput
          style={additionalStyles.input}
          value={experience}
          onChangeText={text => setExperience(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Contact No</Text>
        <TextInput
          style={additionalStyles.input}
          value={phone}
          onChangeText={text => setPhone(text)}
        />

<TextInput
  style={additionalStyles.input}
  value={location}
  onChangeText={text => setLocation(text)}
/>
*/
{/* <Text style={[additionalStyles.label, styles.text]}></Text>
<Text style={[styles.title, styles.text, { margin: 40 }]}>{displayname}</Text>
<Text style={[additionalStyles.label, styles.text]}>Location</Text>
<Picker selectedValue={location} onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}>
  <Picker.Item label="Ang Mo Kio" value="AMK" />
  <Picker.Item label="Yishun" value="YS" />
  <Picker.Item label="Hougang" value="YS" />
  <Picker.Item label="Bedok" value="YS" />
</Picker> */}
{/* <Text style={[additionalStyles.label, styles.text]}>Level</Text>
<Picker selectedValue={level} onValueChange={(itemValue, itemIndex) => setLevel(itemValue)}>
  <Picker.Item label="Basic" value="Beginner" />
  <Picker.Item label="Intermediate" value="Intermediate" />
  <Picker.Item label="Advanced" value="Advanced" />
</Picker>

<Text style={[additionalStyles.label, styles.text]}>Coach experience</Text>
<Picker selectedValue={experience} onValueChange={(itemValue, itemIndex) => setExperience(itemValue)}>
  <Picker.Item label="Intermediate" value="Intermediate" />
  <Picker.Item label="Advanced" value="Advanced" />
</Picker>

<Text style={[additionalStyles.label, styles.text]}>Contact No</Text>
<TextInput
  style={additionalStyles.input}
  value={phone}
  onChangeText={text => setPhone(text)}
/> */}

//  <TouchableOpacity onPress={() => Alert.alert("Alert Pressed")}></TouchableOpacity>