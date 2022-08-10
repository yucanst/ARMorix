import React, { useEffect, useRef, useState } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// Component that contains camera features
export default function Main() {
    const cameraRef = useRef();
    const [cameraPermission, setCameraPermission] = useState(false);
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);

    // Camera settings
    const [flash, setFlash] = useState('off');

    // Tracking settings
    const blinkArr = useRef([]);
    const blinkCounter = useRef(0);
    const [blink, setBlink] = useState(0);
    const [blinkTime, setBlinkTime] = useState();

    // Arm settings
    const [orientation, setOrientation] = useState('portrait');

    const updateOrientation = () => {
        orientation === 'portrait' ? setOrientation('landscape') : setOrientation('portrait');
    };

    const captureImage = async () => {
        const options = { quality: 1, skipProcessing: false };
        try {
            const newImage = await cameraRef.current.takePictureAsync(options);
            MediaLibrary.saveToLibraryAsync(newImage.uri);
        } catch (err) {
            console.log(err);
        }
    };

    const handleFacesDetected = ({ faces }) => {
        if (faces.length === 0) {
            setBlink(0);
        } else {
            faces.map((f, i) => {
                const currentTime = new Date().getTime();
                const closeEye = f.leftEyeOpenProbability < 0.33 && f.rightEyeOpenProbability < 0.33;

                if (blinkArr.current.length >= 5) {
                    blinkArr.current.shift()
                }
                blinkArr.current.push(closeEye);

                if (blink > 0 && currentTime - blinkTime > 1500) {
                    setBlink(0);
                } else if (blinkCounter.current === 0 && blinkArr.current[0] === false && blinkArr.current[2] === true && blinkArr.current[4] === false) {
                    setBlink(blink + 1);
                    setBlinkTime(currentTime);
                    blinkCounter.current = 1;
                }

                if (blinkCounter.current >= 1 && blinkCounter.current < 6) {
                    blinkCounter.current += 1;
                } else {
                    blinkCounter.current = 0;
                }

                if (blink === 3) {
                    setBlink(0);
                    captureImage();
                }
            });
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
        <Camera
            style={styles.cam} ref={cameraRef} flashMode={flash}
            autoFocus='on' type='front' onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                minDetectionInterval: 60,
                mode: FaceDetector.FaceDetectorMode.fast,
                runClassifications: FaceDetector.FaceDetectorClassifications.all,
                tracking: true
            }}
        >
            <View style={styles.camtainer}>
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
        height: windowHeight,
        position: 'absolute',
        width: windowWidth
    },
    camtainer: {
        alignItems: 'center',
        backgroundColor: '#000000',
        bottom: 0,
        flex: 1,
        flexDirection: 'row',
        height: 75,
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
