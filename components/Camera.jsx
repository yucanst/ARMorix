import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';

export default function Main() {
    // Application settings
    const cameraRef = useRef();
    const [cameraPermission, setCameraPermission] = useState(false);
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);
    const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    // Camera settings
    const [direction, setDirection] = useState('center');

    // Arm settings
    const [orientation, setOrientation] = useState('portrait');

    // Tracking settings
    const blinkArr = useRef([]);
    const blinkCounter = useRef(0);
    const [blink, setBlink] = useState(0);
    const [blinkTime, setBlinkTime] = useState();

    const captureImage = async () => {
        try {
            const newImage = await cameraRef.current.takePictureAsync({ quality: 1, skipProcessing: false });
            MediaLibrary.saveToLibraryAsync(newImage.uri);
        } catch (err) {
            console.log(err);
        }
    };

    const updateOrientation = () => {
        orientation === 'portrait' ? setOrientation('landscape') : setOrientation('portrait');
        // setWindowHeight(windowWidth);
        // setWindowWidth(windowHeight);
    };

    const handleCloseEye = (leftEyePosition, rightEyePosition, leftEyeOpenProbability, rightEyeOpenProbability, smilingProbability) => {
        const closeEye = leftEyeOpenProbability < 0.4 && rightEyeOpenProbability < 0.4;
        const currentTime = new Date().getTime();

        // Handle direction
        if (!closeEye) {
            const moveUp = leftEyeOpenProbability < 0.4 && rightEyeOpenProbability > 0.4 && smilingProbability > 0.7;
            const moveDown = leftEyeOpenProbability > 0.4 && rightEyeOpenProbability < 0.4 && smilingProbability > 0.7;
            const moveLeft = leftEyeOpenProbability < 0.4 && rightEyeOpenProbability > 0.4 && smilingProbability < 0.7;
            const moveRight = leftEyeOpenProbability > 0.4 && rightEyeOpenProbability < 0.4 && smilingProbability < 0.7;

            if (!moveUp && !moveDown && !moveLeft && !moveRight) {
                setDirection('center');
            } else {
                setBlink(0);
                if (moveUp && leftEyePosition.y < windowHeight - 10 && rightEyePosition.y < windowHeight - 10) {
                    setDirection('up');
                } else if (moveDown && leftEyePosition.y > 10 && rightEyePosition.y > 10) {
                    setDirection('down');
                } else if (moveLeft && rightEyePosition.x < windowWidth - 10) {
                    setDirection('left');
                } else if (moveRight && leftEyePosition.x > 10) {
                    setDirection('right');
                }
            }
        }

        // Handle blink
        if (blinkArr.current.length >= 5) {
            blinkArr.current.shift()
        }
        blinkArr.current.push(closeEye);

        if (blink > 0 && currentTime - blinkTime > 1200) {
            setBlink(0);
        } else if (blinkCounter.current === 0 && blinkArr.current[0] === false && blinkArr.current[2] && blinkArr.current[4] === false) {
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
    };

    const handleFacesDetected = ({ faces }) => {
        if (faces.length === 0) {
            setBlink(0);
        } else if (faces.length === 1) {
            faces.map((face, index) => {
                handleCloseEye(face.leftEyePosition, face.rightEyePosition, face.leftEyeOpenProbability, face.rightEyeOpenProbability, face.smilingProbability);
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
            style={[styles.cam, { height: windowHeight, width: windowWidth }]} ref={cameraRef}
            autoFocus={Camera.Constants.AutoFocus.on} type={Camera.Constants.Type.front} onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                minDetectionInterval: 60,
                mode: FaceDetector.FaceDetectorMode.fast,
                runClassifications: FaceDetector.FaceDetectorClassifications.all,
                tracking: true
            }}
        >
            <View style={styles.camtainer}>
                {direction === 'center' && <Icon style={styles.icon} />}
                {direction === 'up' && <Icon style={styles.icon} name='arrow-up-outline' />}
                {direction === 'down' && <Icon style={styles.icon} name='arrow-down-outline' />}
                {direction === 'left' && <Icon style={styles.icon} name='arrow-back-outline' />}
                {direction === 'right' && <Icon style={styles.icon} name='arrow-forward-outline' />}
                <Text style={[styles.icon, { fontSize: 45 }]}>{blink}</Text>
                <Icon style={styles.icon} name={orientation === 'portrait' ? 'phone-landscape-outline' : 'phone-portrait-outline'} onPress={updateOrientation} />
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
        fontSize: 30,
        textAlign: 'center'
    },
    preview: {
        opacity: 0
    }
});
