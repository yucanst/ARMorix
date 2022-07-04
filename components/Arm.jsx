import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

// Component to set arm orientation
export default function Orientation({ navigation }) {
    const [orientation, setOrientation] = useState('')

    function selectOrientation() {
        // Default orientation is portrait
        // Send instructions to arm if user selects landscape
        if (orientation === 'landscape' || orientation === 'portrait') {
        }

        navigation.navigate('Camera');
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='phone-portrait-outline'
                    onMouseOver={() => setOrientation('portrait')} onPress={() => selectOrientation()} />
                <Text style={styles.text}>Portrait</Text>
            </View>

            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='phone-landscape-outline'
                    onMouseOver={() => setOrientation('landscape')} onPress={() => selectOrientation()} />
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
        textAlign: 'center',
        paddingBottom: 30
    },
    icon: {
        fontSize: '45vw'
    },
    text: {
        fontSize: 18
    }
});
