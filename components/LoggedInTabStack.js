import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BlogStack from '../components/BlogStack';
import AccountStack from '../components/AccountStack';
import UserStack from '../components/UserStack';
import { FontAwesome } from '@expo/vector-icons'; 
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

export default function LoggedInStack() {

  const isDark = useSelector((state) => state.accountPrefs.isDark);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Coach") {
            iconName = "address-card";
          } else if (route.name === "Booking") {
            iconName = "cog";
          } else if (route.name === "Shortlist") {
            iconName = "user";
          }
          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
        style: {
          backgroundColor: isDark ? "#181818" : "white",
        },
      }}
    >
      <Tab.Screen name="Shortlist" component={UserStack} />
      <Tab.Screen name="Coach" component={BlogStack} />
      <Tab.Screen name="Booking" component={AccountStack} />
    </Tab.Navigator>
  );
}