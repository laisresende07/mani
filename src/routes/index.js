import Icon from "react-native-vector-icons/Feather";
import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../pages/Welcome";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Records from "../pages/Records";
import Categories from "../pages/Categories";
import News from "../pages/News";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import { AuthContext } from "../contexts/auth";
import { View, ActivityIndicator } from "react-native";

const drawerButton = (navigation) => {
  return (
    <Icon
      name="menu"
      size={24}
      style={{ marginLeft: 20 }}
      onPress={() => navigation.toggleDrawer()}
    />
  );
};

const profileButton = (navigation) => {
  return (
    <Icon
      name="user"
      size={24}
      style={{ marginRight: 20 }}
      onPress={() => navigation.navigate("Perfil")}
    />
  );
};

const Drawer = createDrawerNavigator();

const LoginStackNav = createStackNavigator();

function LoginStack() {
  return (
    <LoginStackNav.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        title: "VOLTAR",
        headerStyle: {
          backgroundColor: colors.shape,
          shadowColor: colors.shape,
          elevation: 0,
        },
        headerTintColor: colors.blue,
        headerTitleStyle: {
          fontFamily: fonts.semibold,
          fontSize: 16,
        },
      }}
    >
      <LoginStackNav.Screen
        name="Welcome"
        component={Welcome}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            shadowColor: colors.white,
            elevation: 0,
            height: 0,
          },
          headerTintColor: colors.blue,
          headerTitleStyle: {
            fontFamily: fonts.regular,
          },
        }}
      />
      <LoginStackNav.Screen name="Login" component={Login} />
      <LoginStackNav.Screen name="Register" component={Register} />
    </LoginStackNav.Navigator>
  );
}

const HomeStackNav = createStackNavigator();
function HomeStack() {
  return (
    <HomeStackNav.Navigator initialRouteName="Home">
      <HomeStackNav.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerLeft: () => drawerButton(navigation),
          headerRight: () => profileButton(navigation),
          title: "",
          headerStyle: {
            backgroundColor: colors.shape,
            shadowColor: colors.shape,
            elevation: 0,
          },
          headerTintColor: colors.blue,
          headerTitleStyle: {
            fontFamily: fonts.regular,
          },
        })}
      />
    </HomeStackNav.Navigator>
  );
}

const ProfileStackNav = createStackNavigator();
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator initialRouteName="Perfil">
      <ProfileStackNav.Screen
        name="Perfil"
        component={Profile}
        options={({ navigation }) => ({
          headerLeft: () => drawerButton(navigation),
          headerRight: () => profileButton(navigation),
          title: "",
          headerStyle: {
            backgroundColor: colors.shape,
            shadowColor: colors.shape,
            elevation: 0,
          },
          headerTintColor: colors.blue,
          headerTitleStyle: {
            fontFamily: fonts.regular,
          },
        })}
      />
    </ProfileStackNav.Navigator>
  );
}

const RecordsStackNav = createStackNavigator();
function RecordsStack() {
  return (
    <RecordsStackNav.Navigator initialRouteName="Records">
      <RecordsStackNav.Screen
        name="Records"
        component={Records}
        options={({ navigation }) => ({
          headerLeft: () => drawerButton(navigation),
          headerRight: () => profileButton(navigation),
          title: "",
          headerStyle: {
            backgroundColor: colors.shape,
            shadowColor: colors.shape,
            elevation: 0,
          },
          headerTintColor: colors.blue,
          headerTitleStyle: {
            fontFamily: fonts.regular,
          },
        })}
      />
    </RecordsStackNav.Navigator>
  );
}

const CategoriesStackNav = createStackNavigator();
function CategoriesStack() {
  return (
    <CategoriesStackNav.Navigator initialRouteName="Categories">
      <CategoriesStackNav.Screen
        name="Categories"
        component={Categories}
        options={({ navigation }) => ({
          headerLeft: () => drawerButton(navigation),
          headerRight: () => profileButton(navigation),
          title: "",
          headerStyle: {
            backgroundColor: colors.shape,
            shadowColor: colors.shape,
            elevation: 0,
          },
          headerTintColor: colors.blue,
          headerTitleStyle: {
            fontFamily: fonts.regular,
          },
        })}
      />
    </CategoriesStackNav.Navigator>
  );
}

const NewsStackNav = createStackNavigator();
function NewsStack() {
  return (
    <NewsStackNav.Navigator initialRouteName="News">
      <NewsStackNav.Screen
        name="News"
        component={News}
        options={({ navigation }) => ({
          headerLeft: () => drawerButton(navigation),
          headerRight: () => profileButton(navigation),
          title: "",
          headerStyle: {
            backgroundColor: colors.shape,
            shadowColor: colors.shape,
            elevation: 0,
          },
          headerTintColor: colors.blue,
          headerTitleStyle: {
            fontFamily: fonts.regular,
          },
        })}
      />
    </NewsStackNav.Navigator>
  );
}

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
        drawerContentOptions={{
          labelStyle: {
            fontFamily: fonts.regular,
            fontSize: 16
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
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="Perfil" component={ProfileStack} />
        <Drawer.Screen name="Registros" component={RecordsStack} />
        <Drawer.Screen name="Categorias" component={CategoriesStack} />
        <Drawer.Screen name="Notícias" component={NewsStack} />
      </Drawer.Navigator>
    );
  } else {
    return <LoginStack />;
  }
}

export default RootContainer;
