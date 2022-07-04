import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

// Component to set arm orientation
export default function Orientation({ navigation }) {
    function selectOrientation(orientation) {
        // Default orientation is portrait - send instructions to arm if user selects landscape (?)
        if (orientation === 'landscape' || orientation === 'portrait') {
        }

        navigation.navigate('Camera');
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='phone-portrait-outline' onPress={() => selectOrientation('portrait')} />
                <Text style={styles.text}>Portrait</Text>
            </View>

            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='phone-landscape-outline' onPress={() => selectOrientation('landscape')} />
                <Text style={styles.text}>Landscape</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
        alignItems: 'center',
        textAlign: 'center',
        paddingBottom: 30
    },
    icon: {
        fontSize: 66
    },
    text: {
        fontSize: 18
    }
});
