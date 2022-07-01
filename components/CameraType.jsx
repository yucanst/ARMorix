import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CameraType({ navigation }) {
    const [type, setType] = useState('CameraType.back')

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='camera-outline' onPress={() => navigation.navigate('Orientation')}/>
                <Text>Camera</Text>
            </View>

            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='camera-reverse-outline' onPress={() => navigation.navigate('Orientation')}/>
                <Text>Selfie</Text>
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
        fontSize: '50vw'
    },
});
