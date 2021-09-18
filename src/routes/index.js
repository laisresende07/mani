import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../pages/Welcome";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import DailyRecords from "../pages/DailyRecords";
import MontlyRecords from "../pages/MontlyRecords";
import Categories from "../pages/Categories";
import News from "../pages/News";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import { AuthContext } from "../contexts/auth";
import { View, ActivityIndicator } from "react-native";
import Income from "../pages/Income";
import Expense from "../pages/Expense";
import EditProfile from "../pages/EditProfile";

const LoginStackNav = createStackNavigator();
function LoginStack() {
  return (
    <LoginStackNav.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <LoginStackNav.Screen name="Welcome" component={Welcome} />
      <LoginStackNav.Screen name="Login" component={Login} />
      <LoginStackNav.Screen name="Register" component={Register} />
    </LoginStackNav.Navigator>
  );
}

const ProfileStackNav = createStackNavigator();
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStackNav.Screen name="Profile" component={Profile} />
      <ProfileStackNav.Screen name="EditProfile" component={EditProfile} />
    </ProfileStackNav.Navigator>
  );
}
const Drawer = createDrawerNavigator();

function RootContainer() {
  const { signed, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  if (signed) {
    return (
      <Drawer.Navigator
      initialRouteName="Home"
        drawerStyle={{
          backgroundColor: "#ffffff",
        }}
        screenOptions={{
          headerShown: false,
        }}
        drawerContentOptions={{
          labelStyle: {
            fontFamily: fonts.regular,
            fontSize: 16,
          },
          inactiveTintColor: colors.blue,
          activeTintColor: colors.orange,
          itemStyle: {
            margin: 3,
            borderWidth: 0.5,
            borderColor: colors.orange,
            borderRadius: 6,
          },
        }}
      >
        <Drawer.Screen name="Página inicial" component={Home} />
        <Drawer.Screen name="Categorias" component={Categories} />
        <Drawer.Screen name="Notícias" component={News} />
        <Drawer.Screen name="Nova receita" component={Income} />
        <Drawer.Screen name="Nova despesa" component={Expense} />
        <Drawer.Screen name="Perfil" component={ProfileStack} />
        <Drawer.Screen name="Relatórios diários" component={DailyRecords} />
        <Drawer.Screen name="Relatórios mensais" component={MontlyRecords} />
      </Drawer.Navigator>
    );
  } else {
    return <LoginStack />;
  }
}

export default RootContainer;