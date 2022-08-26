import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
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
    const [image, setImage] = useState(false);
    const [currentElement, setCurrentElement] = useState('orientation');

    // Arm settings
    const [orientation, setOrientation] = useState('portrait');

    // Tracking settings
    const leftEyeCloseArray = useRef([]);
    const rightEyeCloseArray = useRef([]);
    const blinkCounter = useRef(0);
    const winkCounter = useRef(0);
    const [blink, setBlink] = useState(0);
    const [blinkTime, setBlinkTime] = useState(0);
    const [winkTime, setWinkTime] = useState(0);

    const invokeOption = () => {
        setBlink(0);
        if (currentElement === 'orientation') {
            updateOrientation();
        } else if (currentElement === 'photo') {
            captureImage();
        }
    };

    const captureImage = async () => {
        try {
            const newImage = await cameraRef.current.takePictureAsync({ quality: 1, skipProcessing: false });
            MediaLibrary.saveToLibraryAsync(newImage.uri);
            setImage(newImage.uri);
        } catch (err) {
            console.log(err);
        }
    };

    const updateOrientation = () => {
        orientation === 'portrait' ? setOrientation('landscape') : setOrientation('portrait');
        setWindowHeight(windowWidth);
        setWindowWidth(windowHeight);
    };

    const handlePreview = () => {
        setInterval(() => setImage(false), 500);
    };

    const handleCloseEye = (leftEyeOpenProbability, rightEyeOpenProbability) => {
        const leftEyeClose = leftEyeOpenProbability < 0.4;
        const rightEyeClose = rightEyeOpenProbability < 0.4;
        const currentTime = new Date().getTime();

        if (leftEyeCloseArray.current.length === 10 || rightEyeCloseArray.current.length === 10) {
            leftEyeCloseArray.current.shift();
            rightEyeCloseArray.current.shift();
        }
        leftEyeCloseArray.current.push(leftEyeClose);
        rightEyeCloseArray.current.push(rightEyeClose);

        const predictLeftWink = leftEyeCloseArray.current[0] === false && leftEyeCloseArray.current[4] && leftEyeCloseArray.current[9] === false;
        const predictRightWink = rightEyeCloseArray.current[0] === false && rightEyeCloseArray.current[4] && rightEyeCloseArray.current[9] === false;
        const predictBlink = predictLeftWink && predictRightWink;

        if (blink > 0 && currentTime - blinkTime > 1200) {
            setBlink(0);
        } else if (predictBlink && blinkCounter.current === 0) {
            setBlink(blink + 1);
            setBlinkTime(currentTime);
            blinkCounter.current = 1;
        }

        if ((predictLeftWink || predictRightWink) && winkCounter.current === 0) {
            if (currentTime - winkTime > 3000) {
                if (predictLeftWink) {
                    if (currentElement === 'photo') {
                        setCurrentElement('orientation');
                    }
                } else if (predictRightWink) {
                    if (currentElement === 'orientation') {
                        setCurrentElement('photo');
                    }
                }
                setWinkTime(currentTime);
                winkCounter.current = 1;
            }
        }

        if (blinkCounter.current >= 1 && blinkCounter.current < 6) {
            blinkCounter.current += 1;
        } else {
            blinkCounter.current = 0;
        }

        if (winkCounter.current >= 1 && winkCounter.current < 3) {
            winkCounter.current += 1;
        } else {
            winkCounter.current = 0;
        }

        if (blink === 3) {
            invokeOption();
        }
    };

    const handleFacesDetected = ({ faces }) => {
        if (faces.length === 0) {
            setBlink(0);
        } else if (faces.length === 1) {
            faces.map((face, index) => {
                handleCloseEye(face.leftEyeOpenProbability, face.rightEyeOpenProbability);
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

    if (image) {
        return <Image style={[styles.preview, { height: windowHeight, width: windowWidth }]} source={{ uri: image }} onLoadStart={handlePreview} />
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
                <Icon style={currentElement === 'orientation' ? [styles.icon, { color: '#ffd700' }] : styles.icon}
                    name={orientation === 'portrait' ? 'phone-landscape-outline' : 'phone-portrait-outline'} />
                <Text style={[styles.icon, { fontSize: 45 }]}>{blink}</Text>
                <Icon style={currentElement === 'photo' ? [styles.icon, { color: '#ffd700' }] : styles.icon} name='camera-outline' />
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
        opacity: 0.7,
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
