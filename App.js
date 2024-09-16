import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1}}>
            <NavigationContainer>
                <BottomTabNavigator/>
            </NavigationContainer>
        </GestureHandlerRootView>
    )
}

export default App;