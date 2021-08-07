import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, FlatList, RefreshControl} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { API, API_POSTS, API_COACHES } from "../constants/API";
//import { lightStyles } from "../styles/commonStyles";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";

export default function IndexScreen({ navigation, route }) {

  const [posts, setPosts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  //const styles = lightStyles;
  const [refreshing, setRefreshing] = useState(false);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = isDark ? darkStyles : lightStyles;
  const token = useSelector((state) => state.auth.token);
  const loginuser = useSelector((state) => state.auth.loginuser);
  //console.log("is token correct?", token);

  // This is to set up the top right button
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity onPress={addPost}>
  //         <FontAwesome name="plus" size={24} style={{ color: styles.headerTint, marginRight: 15 }} />
  //       </TouchableOpacity>
  //     ),
  //   });
  // });

  useEffect(() => {
    console.log("LHT", loginuser,  token);
    getCoaches();
  }, []);


  useEffect(() => {
    console.log("Setting up coach listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      //console.log("Running coach listener");
      console.log(token);
      getCoaches();
    });
    getCoaches();
    return removeListener;
  }, []);

  // async function getPosts() {
  //   console.log("at getPosts token=", token); //const token = await AsyncStorage.getItem("token");
  //   try {
  //     const response = await axios.get(API + API_POSTS, {
  //       headers: { Authorization: `JWT ${token}` },
  //     })
  //     console.log("response", response.data);
  //     //console.log(token);
  //     //setPosts(response.data);
  //     setPosts(response.data);
  //     return "completed"
  //   } catch (error) {
  //     console.log(error.response.data);
  //     if (error.response.data.error = "Invalid token") {
  //       navigation.navigate("SignInSignUp");
  //     }
  //   }
  // }

  async function getCoaches() {
    console.log("at getcoachs token=", token); //const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(API + API_COACHES);
      console.log("coach response", response.data);
      //console.log(token);
      //setPosts(response.data);
      setCoaches(response.data);
      return "completed"
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.error = "Invalid token") {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    const response = await getCoaches();
    setRefreshing(false);
  }

  function addPost() {
    navigation.navigate("Add")
  }

  // async function deletePost(id) {
  //   //const token = await AsyncStorage.getItem("token");
  //   console.log("Deleting " + id);
  //   try {
  //     const response = await axios.delete(API + API_POSTS + `/${id}`, {
  //       headers: { Authorization: `JWT ${token}` },
  //     })
  //     console.log(response);
  //     setPosts(posts.filter((item) => item.id !== id));
  //   } catch (error) {
  //     console.log(error)
  //   }   
  // }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>
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
          <Text style={styles.text}>{item.displayname}, skill level: {item.experience}, fee: ${item.fee}, location: {item.location}</Text>
          {/* <TouchableOpacity onPress={() => deletePost(item)}>
            <FontAwesome name="trash" size={20} color="#a80000" />
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={coaches}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl
          colors={["#9Bd35A", "#689F38"]}
          refreshing={refreshing}
          onRefresh={onRefresh}/>}
      />
    </View>
  );
}

//      <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>