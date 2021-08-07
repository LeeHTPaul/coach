import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
//import { commonStyles, lightStyles } from "../styles/commonStyles";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API, API_POSTS } from "../constants/API";
import { useSelector } from "react-redux";

export default function ShowScreen({ navigation, route }) {

  const [post, setPost] = useState({title: "", content: "", createdUser: "", createdAt : ""});
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const loginuser = useSelector((state) => state.auth.loginuser);
  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };
  const [coach, setCoach] = useState({displayname: "", experience: "", location: "", fee : "", level : ""});
  const postdate = new Date(post.createdAt);
  //const postdate2 = postdate.toDateString() + " " + postdate.toLocaleTimeString('en-us');
  //const postdate = new Date(post.createdAt);
  const postdate2 = postdate.toDateString() + " " + postdate.toLocaleTimeString('en-us');
  //const postdate2 = post.createdAt;


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={editPost} style={{marginRight: 10}}>
          <FontAwesome name="pencil-square-o" size={30} color={styles.headerTint} />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    //console.log(route.params.post)
    getPost();
  }, [])
 
  //     const response = await axios.get(API + API_COACHES + "/" + id, {
  async function getPost() {
    //const token = await AsyncStorage.getItem("token");
    const id = route.params.id
    console.log("getPost()",route.params)
    try {
      const response = await axios.get( 'https://LHT2021.pythonanywhere.com/coaches/' + id, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log(response.data);
      setCoach(response.data);
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.error = "Invalid token") {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  function editPost() {
    navigation.navigate("Edit", { post: post })
    getPost();
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.text, { margin: 40 }]}>{coach.displayname}</Text>
      <Text style={[styles.content, styles.text, { margin: 20 }]}>Skill level : {coach.experience}</Text>
      <Text style={[styles.content, styles.text, { margin: 20 }]}>Teaching level : {coach.level}</Text>
      <Text style={[styles.content, styles.text, { margin: 20 }]}>Fee : {coach.fee}</Text>
      <Text style={[styles.content, styles.text, { margin: 20 }]}>Location : {coach.location}</Text>
    </View>
  );
}

//