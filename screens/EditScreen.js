import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import { API, API_POSTS } from "../constants/API";
import axios from "axios";
import { useSelector } from "react-redux";

export default function EditScreen({ navigation, route }) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const loginuser = useSelector((state) => state.auth.loginuser);
  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };

  useEffect(() => {
    const post = route.params.post
    setTitle(post.title);
    setContent(post.content);
  }, [])

  async function editPost() {
    const post = {
      "title": title,
      "content": content,
    }
    const id = route.params.post.id
    try {
      console.log(token);
      const response = await axios.put(API + API_POSTS + "/" + id, post, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log(response.data)
      navigation.navigate("Index")
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}></Text>
        <Text style={[styles.title, styles.text, { margin: 40 }]}>{content}</Text>
        <Text style={[additionalStyles.label, styles.text]}>Fees charged</Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={text => setTitle(text)}
        />
      <TouchableOpacity style={[styles.button, {marginTop: 20}]} onPress={editPost}>
        <Text style={styles.buttonText}>
          Save
        </Text>
        </TouchableOpacity>
      </View>
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
