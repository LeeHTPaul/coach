import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import { API, API_CREATE, API_WHOAMI } from "../constants/API";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightStyles, darkStyles, commonStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";

export default function CreateScreen({ navigation }) {

  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const loginuser = useSelector((state) => state.auth.loginuser);
  const styles = {...commonStyles, ...isDark ? darkStyles : lightStyles };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [errText, seterrText] = useState("");
  
  //const postdate = new Date(post.createdAt);
  //const postdate2 = postdate.toDateString() + " " + postdate.toLocaleTimeString('en-us');
  //const postdate2 = postdate.toDateString();

  async function savePost() {
    const post = {
      "title": title,
      "content": content, 
      "username" : username,
    }
    //const token = await AsyncStorage.getItem("token");
    if (title == "") { seterrText("Title cannot be space");}
    else if (content == "") { seterrText("Content cannot be space"); }
    else
    {
      try {
        console.log(token);
        const response = await axios.post(API + API_CREATE, post, {
          headers: { Authorization: `JWT ${token}` }
        });
        console.log(response.data)
        navigation.navigate("Index", { post: post })
      } catch (error) {
        console.log(error)
      }
    }  //else {}
  }

  useEffect(() => {
    console.log("seb",token);
    getUsername();
  }, []);

  async function getUsername() {
    console.log("---- Getting user name (create) ----");
    //const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
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

  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}>Confirm to select this coach? </Text>
        <Text style={[additionalStyles.label, styles.text], {fontSize : 20, color : "brown"}}>Name : {displayname}</Text>
        <Text style={[additionalStyles.label, styles.text]}>Fees: {fee}</Text>
      <TouchableOpacity style={[styles.button, {marginTop: 20}]} onPress={savePost}>
        <Text style={styles.buttonText}>
          Save
        </Text>
        </TouchableOpacity>
      </View>

      <Text style={[additionalStyles.label, styles.text], {backgroundColor: "red", fontSize : 20, color : "white"}}>{errText}</Text>
    </View>
  )
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

//      <Text style={[additionalStyles.label, styles.text], {fontSize : 20, color : "brown"}}>created by : {username}</Text>