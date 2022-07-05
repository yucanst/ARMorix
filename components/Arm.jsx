import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
            <View style={styles.topContainer}>
                <Text style={styles.title}>Select your{'\n'}Orientation</Text>
                <Text style={styles.description}>take the image in your{'\n'}desired orientation!</Text>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => selectOrientation('portrait')}>
                    <Icon style={{ fontSize: 66 }} name='phone-portrait-outline' />
                    <Text style={styles.label}>Portrait</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconContainer} onPress={() => selectOrientation('landscape')}>
                    <Icon style={{ fontSize: 66 }} name='phone-landscape-outline' />
                    <Text style={styles.label}>Landscape</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        flex: 1
    },
    topContainer: {
        height: '25%',
        justifyContent: 'center',
        marginTop: 45,
        paddingLeft: 45
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25
    },
    description: {
        fontSize: 18,
        paddingTop: 15,
        paddingBottom: 15
    },
    bottomContainer: {
        alignItems: 'center',
        textAlign: 'center',
        width: '100%'
    },
    iconContainer: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        border: '1px solid black',
        borderRadius: 30,
        height: 200,
        justifyContent: 'center',
        marginBottom: 50,
        width: '80%'
    },
    label: {
        fontSize: 18,
        fontStyle: 'italic',
        paddingTop: 10
    }
});
