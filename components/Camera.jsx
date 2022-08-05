import React, { useEffect, useRef, useState } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AutoFocus, Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

// Component that contains camera features
export default function Main() {
    const cameraRef = useRef();
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(false);

    // Camera settings
    const [type, setType] = useState(CameraType.back);
    const [flash, setFlash] = useState(FlashMode.off);
    const [zoom, setZoom] = useState(0);

    // Arm settings
    const [orientation, setOrientation] = useState('portrait');

    const updateOrientation = () => {
        orientation === 'portrait' ? setOrientation('landscape') : setOrientation('portrait');
    };

    const updateZoom = feature => {
        if (feature === 'out' && zoom > 0) {
            setZoom(zoom - 0.1);
        } else if (feature === 'in' && zoom < 1) {
            setZoom(zoom + 0.1);
        }
    };

    const captureImage = async () => {
        const options = { quality: 1, skipProcessing: false };

        try {
            const newImage = await cameraRef.current.takePictureAsync(options);
            MediaLibrary.saveToLibraryAsync(newImage.uri);
            Alert.alert('Success', 'Image has been saved!');
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        (async () => {
            const camPermission = await Camera.requestCameraPermissionsAsync();
            const mlPermission = await MediaLibrary.requestPermissionsAsync();
            setCameraPermission(camPermission.status === 'granted');
            setMediaLibraryPermission(mlPermission.status === 'granted');
        })();
    }, [])

    if (!cameraPermission) {
        return <Text>Please allow Camera permission in Settings.</Text>
    }

    if (!mediaLibraryPermission) {
        return <Text>Please allow Gallery permission in Settings.</Text>
    }

    return (
        <Camera style={{ flex: 1 }} ref={cameraRef} type={type} flashMode={flash} zoom={zoom} autoFocus={AutoFocus.on}>
            <View style={styles.camtainer}>
                <MaterialIcon style={styles.icon} name='zoom-out' onPress={() => updateZoom('out')} />
                {flash === FlashMode.on ?
                    <IonIcon style={[styles.icon, { color: '#ffd700' }]} name='flash-outline' onPress={() => setFlash(FlashMode.off)} /> :
                    <IonIcon style={styles.icon} name='flash-off-outline' onPress={() => setFlash(FlashMode.on)} />
                }
                <MaterialIcon style={styles.icon} name='zoom-in' onPress={() => updateZoom('in')} />
            </View>

            <View style={[styles.camtainer, { bottom: 0 }]}>
                {orientation === 'portrait' ?
                    <IonIcon style={styles.icon} name='phone-landscape-outline' onPress={updateOrientation} /> :
                    <IonIcon style={styles.icon} name='phone-portrait-outline' onPress={updateOrientation} />
                }
                <IonIcon style={[styles.icon, { fontSize: 50 }]} name='md-radio-button-on-outline' onPress={captureImage} />
                <IonIcon style={styles.icon} name='camera-reverse-outline' onPress={() => {
                    setType(type === CameraType.back ? CameraType.front : CameraType.back);
                }} />
            </View>
        </Camera>
    )
}

const styles = StyleSheet.create({
    camtainer: {
        alignItems: 'center',
        backgroundColor: '#000000',
        flex: 1,
        flexDirection: 'row',
        height: 70,
        opacity: 0.5,
        position: 'absolute',
        width: '100%'
    },
    icon: {
        color: '#ffffff',
        flex: 1,
        fontSize: 25,
        textAlign: 'center'
    }

    // Edit - to be confirmed
});
