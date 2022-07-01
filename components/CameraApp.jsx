import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

export default function CameraApp() {
    const [permission, setPermission] = useState(false);
    const [type, setType] = useState(CameraType.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted');
        })();
    }, []);

    if (permission === false) {
        return <Text>No access to camera</Text>;
    } else {
        return (
            <View style={styles.container}>
                <Camera
                    style={{ flex: 1, width: "100%" }}
                    type={type}
                ></Camera>
                <TouchableOpacity onPress={() => {
                    setType(type === CameraType.back ? CameraType.front : CameraType.back)
                }}>
                    <Text>Flip</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
