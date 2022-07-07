import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AutoFocus, Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

let camOrientation = 'portrait';

// Component to select portrait/landscape mode
function Orientation({ navigation }) {
    function selectOrientation(orientation) {
        // Default orientation is portrait - send instructions to arm if user selects landscape (?)
        if (orientation === 'landscape') {
            camOrientation = 'landscape';
        }

        navigation.navigate('Camera');
    };

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
    );
};

// Component that contains camera features
function Cam({ navigation }) {
    const cameraRef = useRef();
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(false);
    const [image, setImage] = useState();

    // Camera settings
    const [type, setType] = useState(CameraType.back);
    const [flash, setFlash] = useState(FlashMode.off);
    const [zoom, setZoom] = useState(0);

    useEffect(() => {
        (async () => {
            const camPermission = await Camera.requestCameraPermissionsAsync();
            const mlPermission = await MediaLibrary.requestPermissionsAsync();
            setCameraPermission(camPermission.status === 'granted');
            setMediaLibraryPermission(mlPermission.status === 'granted');
        })();
    }, []);

    if (!cameraPermission) {
        return <Text>Please allow Camera permission in Settings.</Text>
    };

    if (!mediaLibraryPermission) {
        return <Text>Please allow Gallery permission in Settings.</Text>
    };

    async function captureImage() {
        const options = { quality: 1, skipProcessing: false };

        try {
            const newImage = await cameraRef.current.takePictureAsync(options);
            MediaLibrary.saveToLibraryAsync(newImage.uri);
            Alert.alert('Success', 'Image has been saved!');
            navigation.navigate("Orientation");
        } catch (err) {
            console.log(err);
        };
    };

    return (
        <Camera style={{ flex: 1 }} ref={cameraRef} type={type} flashMode={flash} zoom={zoom} autoFocus={AutoFocus.on}>
            <View style={styles.camtainer}>
                {flash === FlashMode.on ?
                    <Icon style={[styles.icon, { color: '#ffd700' }]} name='flash-outline' onPress={() => setFlash(FlashMode.off)} /> :
                    <Icon style={styles.icon} name='flash-off-outline' onPress={() => setFlash(FlashMode.on)} />
                }
            </View>

            <View style={[styles.camtainer, { bottom: 0 }]}>
                <Icon style={styles.icon} name='videocam-outline' />
                <Icon style={[styles.icon, { fontSize: 45 }]} name='md-radio-button-on-outline' onPress={() => captureImage()} />
                <Icon style={styles.icon} name='camera-reverse-outline' onPress={() => {
                    setType(type === CameraType.back ? CameraType.front : CameraType.back);
                }} />
            </View>
        </Camera>
    );
};

export { Orientation, Cam };

const styles = StyleSheet.create({
    // Orientation
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
        borderColor: '#000000',
        borderRadius: 30,
        borderWidth: 1,
        height: 200,
        justifyContent: 'center',
        marginBottom: 33,
        width: '80%'
    },
    label: {
        fontSize: 18,
        fontStyle: 'italic',
        paddingTop: 10
    },

    // Camera
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
