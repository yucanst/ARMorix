import React, { useEffect, useRef, useState } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// Component that contains camera features
export default function Main() {
    const backCamRef = useRef();
    const [cameraPermission, setCameraPermission] = useState(false);
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);

    // Camera settings
    const [height, setHeight] = useState(windowHeight);
    const [width, setWidth] = useState(windowWidth);
    const [flash, setFlash] = useState('off');
    const [zoom, setZoom] = useState(0);

    // Arm settings
    const [orientation, setOrientation] = useState('portrait');

    const updateOrientation = () => {
        orientation === 'portrait' ? setOrientation('landscape') : setOrientation('portrait');
        setHeight(width);
        setWidth(height);
    };

    const updateZoom = op => {
        if (op === 'out' && zoom > 0) {
            setZoom(zoom - 0.1);
        } else if (op === 'in' && zoom < 1) {
            setZoom(zoom + 0.1);
        }
    };

    const captureImage = async () => {
        const options = { quality: 1, skipProcessing: false };

        try {
            const newImage = await backCamRef.current.takePictureAsync(options);
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
    }, []);

    if (!cameraPermission || !mediaLibraryPermission) {
        return <Text>Please allow Camera and Gallery permissions in Settings.</Text>
    };

    return (
        <Camera style={[styles.cam, { height: height, width: width }]} ref={backCamRef} flashMode={flash} zoom={zoom} autoFocus='on' type='back'>
            <View style={styles.camtainer}>
                <MaterialIcon style={styles.icon} name='zoom-out' onPress={() => updateZoom('out')} />
                <MaterialIcon style={styles.icon} name='zoom-in' onPress={() => updateZoom('in')} />
            </View>

            <View style={[styles.camtainer, { bottom: 0 }]}>
                {flash === 'on' ?
                    <IonIcon style={[styles.icon, { color: '#ffd700' }]} name='flash-outline' onPress={() => setFlash('off')} /> :
                    <IonIcon style={styles.icon} name='flash-off-outline' onPress={() => setFlash('on')} />
                }
                <IonIcon style={[styles.icon, { fontSize: 50 }]} name='md-radio-button-on-outline' onPress={captureImage} />
                <IonIcon style={styles.icon} name={orientation === 'portrait' ? 'phone-landscape-outline' : 'phone-portrait-outline'} onPress={updateOrientation} />
            </View>
        </Camera>
    );
};

const styles = StyleSheet.create({
    cam: {
        flex: 1,
        position: 'absolute'
    },
    camtainer: {
        alignItems: 'center',
        backgroundColor: '#000000',
        flex: 1,
        flexDirection: 'row',
        height: 70,
        opacity: 0.5,
        position: 'absolute',
        width: '100%',
        zIndex: 100
    },
    icon: {
        color: '#ffffff',
        flex: 1,
        fontSize: 25,
        textAlign: 'center'
    }
});
