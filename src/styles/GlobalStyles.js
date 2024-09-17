import { StyleSheet } from "react-native";
import colors from "./theme";

const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    primaryText: {
        color: colors.primaryText,
    },
    secondaryText: {
        color: colors.secondaryText,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primaryText,
    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: colors.buttonBackground,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        color: colors.buttonText,
    },    
});

export default GlobalStyles;