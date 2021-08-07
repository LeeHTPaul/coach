import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Image, ImageBackground, TouchableOpacity, UIManager, LayoutAnimation, ActivityIndicator, Keyboard, Platform, ImageBackgroundBase } from 'react-native';
import { API, API_LOGIN, API_SIGNUP } from '../constants/API';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logInAction, updateLoginAction, updateNameAction, setCoachAction, updateUserNoAction } from '../redux/ducks/blogAuth';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android

export default function SignInSignUpScreen({ navigation }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayname, setdisplayname] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const reduxtoken = useSelector((state) => state.auth.token)
  const [isLogIn, setIsLogIn] = useState(true)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [coach, setCoach] = useState(false)
  const [location, setLocation] = useState("")
  const [level, setlevel] = useState("Beginner")
  const [experience, setexperience] = useState("")
  const [phoneno, setPhone] = useState("")
  const [fee, setfee] = useState(100)
  const dispatch = useDispatch()
  const loginname = useSelector((state) => state.auth.loginname);
  const is_coach = useSelector((state) => state.auth.is_coach);
  const userphoneno = useSelector((state) => state.auth.uphoneno);
  const [checked, setChecked] = React.useState('user');

  async function login() {
    console.log("---- Login time ----");
    Keyboard.dismiss();

    try {
      setLoading(true);
      const response = await axios.post(API + API_LOGIN, {
        username,
        password,
      });
      console.log("Success logging in!");
      // console.log(response);
      //console.log(response.data.access_token)
      console.log("token received",response.data, "state", reduxtoken);
      dispatch({ ...logInAction(), payload: response.data.access_token });
      dispatch({ ...updateLoginAction(), payload: username });
      //reduxtoken = useSelector((state) => state.auth.token)
      console.log("after", reduxtoken);
      // await AsyncStorage.setItem("token", response.data.access_token);
      setLoading(false);
      setUsername("");
      setPassword("");
      setdisplayname("");
      //console.log("Sign in complete, going to Indexscreen");
      //console.log(reduxtoken);
      navigation.navigate("Logged In");  //      navigation.navigate("Logged In");
    } catch (error) {
      setLoading(false);
      console.log("Error logging in!");
      console.log(error);
      setErrorText(error.response.status);
      //setErrorText(response.data.description);
      if (error.response.status = 404) {
        setErrorText("User does not exist")
      }
    }
  }

  // useEffect(() => {
  //   //onst userphoneno = useSelector((state) => state.auth.uphoneno);
  //     console.log("checked coach", checked, coach);
  //     if (checked == 'coach') {
  //       dispatch({ ...setCoachAction(), payload: true }); console.log("incheck coach");
  //     } else {
  //       dispatch({ ...setCoachAction(), payload: false }); console.log("incheck coach false");
  //     }

  //     //loginuser = useSelector((state) => state.auth.loginuser);
  //   }, []);

  function checkcoach1(){
      setChecked('user');
      dispatch({ ...setCoachAction(), payload: false }); console.log("incheck coach false");
  }

  function checkcoach2(){
      setChecked('coach');
      dispatch({ ...setCoachAction(), payload: true }); console.log("incheck coach true");
  }
  async function getUsername() {
    console.log("---- Getting user name (login) ----");
    //const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name sign up", response);
      // console.log("ht1",response.data.username, loginuser);
      dispatch({ ...setCoachAction(), payload: response.data.coach })
      dispatch({ ...updateNameAction(), payload: response.data.displayname })
      dispatch({ ...updateUserNoAction(), payload: response.data.phoneno })
      console.log("ht signup",loginuser, "display", loginname, "coach", is_coach, "phone", userphoneno );
      // getSelected(response.data.location);

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

  async function signUp() {
    setCoach(is_coach);
    if (password != confirmPassword || password == "") {
      setErrorText("Your passwords don't match. Check and try again.")
    } else
      if (location == "") {
        setErrorText("Please select location.")
      } else
        if (displayname == "") {
          setErrorText("Please enter Display Name.")
        } else
          if (phoneno == "") {
            setErrorText("Please enter Phone No.")
          } else {
            try {
              setLoading(true);
              // setlocation("Ang Mo Kio");
              // setfee(150);
              const response = await axios.post(API + API_SIGNUP, {
                username,
                password,
                displayname,
                coach,
                level,
                location,
                phoneno,
              });
              if (response.data.Error) {
                // We have an error message for if the user already exists
                setErrorText(response.data.Error);
                setLoading(false);
              } else {
                console.log("Success signing up!");
                setLoading(false);
                login();
              }
            } catch (error) {
              setLoading(false);
              console.log("Error logging in!");
              console.log(error.response);
              setErrorText(error.response.data.description);
            }
          }
  }

  return (
    <View style={styles.container}> 
      <ImageBackground style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}} source={require("../assets/swim.jpg")} resizeMode="cover" >

      <Text style={styles.title}>
        {/* {isLogIn ? "Login" : "SignUp"} */}
        "Swim Coach for Hire"
      </Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Username:"
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={(username) => setUsername(username)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password:"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(pw) => setPassword(pw)}
        />
      </View>
      {isLogIn ? <View /> :
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password:"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(pw) => setConfirmPassword(pw)}
          />
        </View>}
        
      {isLogIn ? <View /> :
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Display Name:"
            placeholderTextColor="#003f5c"
            value={displayname}
            secureTextEntry={false}
            onChangeText={(text) => setdisplayname(text)}
          />
        </View>}
        {isLogIn ? <View /> :
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Handphone No:"
            placeholderTextColor="#003f5c"
            value={phoneno}
            secureTextEntry={false}
            onChangeText={(text) => setPhone(text)}
          />
        </View>}
        {isLogIn ? <View /> :
        <View style={{ flexDirection: "row", height: 30, borderRadius: 30, backgroundColor: "#FFC0CB", marginBottom: 20 }}><Text> Location : </Text>
          <Picker selectedValue={location} onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}>
            <Picker.Item label="North" value="North" />
            <Picker.Item label="South" value="South" />
            <Picker.Item label="Central" value="Central" />
            <Picker.Item label="East" value="East" />
            <Picker.Item label="West" value="West" />
          </Picker>
          <RadioButton
        value="user"
        status={ checked === 'user' ? 'checked' : 'unchecked' }
        onPress={() => checkcoach1()}   
      />
            <RadioButton
        value="coach"
        status={ checked === 'coach' ? 'checked' : 'unchecked' }
        onPress={() => checkcoach2()}
      />
        </View>}

        <View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.button} onPress={isLogIn ? login : signUp}>
            <Text style={styles.buttonText}> {isLogIn ? "Log In" : "Sign Up as user"} </Text>
          </TouchableOpacity>
          {loading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : <View />}
        </View>
      </View>
      <Text style={styles.errorText}>
        {errorText}
      </Text>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 700,
            create: { type: 'linear', property: 'opacity' },
            update: { type: 'spring', springDamping: 0.4 }
          });
          setIsLogIn(!isLogIn);
          setErrorText("");
        }}>
        <Text style={styles.switchText}> {isLogIn ? "No account? Sign up now." : "Already have an account? Log in here."}</Text>
      </TouchableOpacity>
      </ImageBackground>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   /* backgroundColor: '#7CA1B4', */
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40,
    margin: 20
  },
  switchText: {
    fontWeight: '400',
    fontSize: 20,
    marginTop: 20
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    height: 30,
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 25,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 15,
    margin: 12,
    color: 'white',
    marginTop : 10,
  },
  errorText: {
    fontSize: 15,
    color: 'red',
    marginTop: 20
  }
});
