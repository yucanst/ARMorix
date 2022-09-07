import React, { useEffect, useRef, useState } from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Buffer } from 'buffer';
import { Camera } from 'expo-camera';
import { navigateOptions } from './Navigation';
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';

const FIRST_ELEMENT = 'orientation';
const LAST_ELEMENT = 'photo';

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

    // Bluetooth settings
    const bluetoothMessage = useRef('');
    const [bluetoothSocket, setBluetoothSocket] = useState(false);
    const [orientation, setOrientation] = useState('portrait');

    // Tracking settings
    const leftEyeCloseArray = useRef([]);
    const rightEyeCloseArray = useRef([]);
    const counter = useRef(0);
    const blinkTime = useRef(0);
    const [blink, setBlink] = useState(0);

    // Function that invokes action with respective to current element/option selected
    const invokeOption = () => {
        setBlink(0);
        if (currentElement === 'orientation') {
            updateOrientation();
        } else if (currentElement === 'photo') {
            captureImage();
        }
    };

    // Function that allows users to capture an image and save it to their gallery
    const captureImage = async () => {
        try {
            const newImage = await cameraRef.current.takePictureAsync({ quality: 1, skipProcessing: false });
            MediaLibrary.saveToLibraryAsync(newImage.uri);
            setImage(newImage.uri);
        } catch (err) {
            console.log(err);
        }
    };

    // Function to send data via Bluetooth
    const sendDataToArduino = async () => {
        try {
            await RNBluetoothClassic.writeToDevice(bluetoothSocket.address, bluetoothMessage.current);
            await bluetoothSocket.write(Buffer.alloc(1, bluetoothMessage.current));
        } catch (err) {
            console.log(err);
        }
    }

    // Function that allows user to toggle between portrait and landscape mode
    const updateOrientation = () => {
        orientation === 'portrait' ? setOrientation('landscape') : setOrientation('portrait');
        setWindowHeight(windowWidth);
        setWindowWidth(windowHeight);
    };

    // Function that checks if face is centered in frame
    const centerFaceInFrame = (bounds, yawAngle) => {
        // 30x30 square in the center of the frame
        const centerSquare = {
            top: windowHeight / 2 - 30,
            bottom: windowHeight / 2 + 30,
            left: windowWidth / 2 - 30,
            right: windowWidth / 2 + 30
        }

        // Middle point of the user's face
        const faceMiddlePoint = {
            x: (bounds.origin.x * 2 + bounds.size.width) / 2,
            y: (bounds.origin.y * 2 + bounds.size.height) / 2,
        }

        // Ensure middle point of user's face is inside 30x30 square (x and y)
        if (faceMiddlePoint.x < centerSquare.left) {
            bluetoothMessage.current = 'r';
        } else if (faceMiddlePoint.x > centerSquare.right) {
            bluetoothMessage.current = 'l';
        } else if (faceMiddlePoint.y < centerSquare.top) {
            bluetoothMessage.current = 'd';
        } else if (faceMiddlePoint.y > centerSquare.bottom) {
            bluetoothMessage.current = 'u';
        } else {
            bluetoothMessage.current = 'c';
        }

        // Ensure face is facing front (z)
        /* if (yawAngle > 15 && yawAngle <= 180) {
            console.log('Tilted towards right.');
        } else if (yawAngle > 180 && yawAngle < 345) {
            console.log('Tilted towards left.');
        } */

        // Ensure HC-05 active socket before sending data
        if (RNBluetoothClassic.getConnectedDevice(bluetoothSocket.address)) {
            sendDataToArduino();
        }
    }

    const handlePreview = () => {
        setInterval(() => setImage(false), 500);
    };

    // Function that handles blinks and winks
    const handleCloseEye = (leftEyeOpenProbability, rightEyeOpenProbability) => {
        const currentTime = new Date().getTime();
        const leftEyeClose = leftEyeOpenProbability < 0.33;
        const rightEyeClose = rightEyeOpenProbability < 0.33;

        if (leftEyeCloseArray.current.length === 10 || rightEyeCloseArray.current.length === 10) {
            leftEyeCloseArray.current.shift();
            rightEyeCloseArray.current.shift();
        }
        leftEyeCloseArray.current.push(leftEyeClose);
        rightEyeCloseArray.current.push(rightEyeClose);

        // Boolean variables that predict whether user has blinked/winked (eyes open -> close -> open)
        const predictLeftWink = leftEyeCloseArray.current[0] === false && leftEyeCloseArray.current[4] && leftEyeCloseArray.current[9] === false;
        const predictRightWink = rightEyeCloseArray.current[0] === false && rightEyeCloseArray.current[4] && rightEyeCloseArray.current[9] === false;
        const predictBlink = predictLeftWink && predictRightWink;

        if (blink > 0 && currentTime - blinkTime.current > 1000) { // Reset blink count if next blink not within 1s (not consecutive)
            setBlink(0);
        } else if (predictBlink && counter.current === 0) { // Increase blink count upon blink
            setBlink(blink + 1);
            blinkTime.current = currentTime;
            counter.current = 1;
        } else if ((predictLeftWink || predictRightWink) && counter.current === 0) { // Navigate element/option upon winks
            if (predictLeftWink && currentElement !== FIRST_ELEMENT) {
                setCurrentElement(navigateOptions('left', currentElement));
            } else if (predictRightWink && currentElement !== LAST_ELEMENT) {
                setCurrentElement(navigateOptions('right', currentElement));
            }
            counter.current = 1;
            setBlink(0);
        }

        // Prevent unnecessary loops
        if (counter.current >= 1 && counter.current < 6) {
            counter.current += 1;
        } else {
            counter.current = 0;
        }

        // Trigger event upon 3 consecutive blinks
        if (blink === 3) {
            invokeOption();
        }
    };

    /*
        Function that handles detected faces, refer to:
        https://docs.expo.dev/versions/latest/sdk/facedetector/#facefeature
        Currently programmed to support only 1 face in frame at all times
    */
    const handleFacesDetected = async ({ faces }) => {
        if (faces.length === 0) {
            setBlink(0);
        } else {
            const face = faces[0];
            const btConnection = await bluetoothSocket.isConnected();
            handleCloseEye(face.rightEyeOpenProbability, face.leftEyeOpenProbability);
            if (btConnection) { // Ensure HC-05 is connected
                centerFaceInFrame(face.bounds, face.yawAngle);
            } else {
                bluetoothSocket.connect();
            }
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const bondedDevices = await RNBluetoothClassic.getBondedDevices();
                bondedDevices.forEach(bt => {
                    if (bt.name === 'HC-05') {
                        setBluetoothSocket(bt); // Retrieve HC-05 details from paired devices
                        RNBluetoothClassic.cancelDiscovery();
                    }
                });
            } catch (err) {
                console.log(err);
            } finally {
                const camPermission = await Camera.requestCameraPermissionsAsync();
                setCameraPermission(camPermission.status === 'granted');
                const mlPermission = await MediaLibrary.requestPermissionsAsync();
                setMediaLibraryPermission(mlPermission.status === 'granted');
            }
        })();
    }, []);

    if (image) {
        return <Image style={[styles.preview, { height: windowHeight, width: windowWidth }]} source={{ uri: image }} onLoadStart={handlePreview} />
    };

    // Ensure necessary permissions were given by user before rendering application
    if (!bluetoothSocket) {
        return <Text>Please ensure device is connected with HC-05 via Bluetooth.</Text>
    } else {
        // Handle BT state changes
    }

    if (!cameraPermission || !mediaLibraryPermission) {
        return <Text>Please allow Camera and Gallery permissions in Settings.</Text>
    };

    // Application (camera) user interface
    return (
        <Camera
            style={[styles.cam, { height: windowHeight, width: windowWidth }]} ref={cameraRef}
            autoFocus={Camera.Constants.AutoFocus.on} type={Camera.Constants.Type.front} onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                minDetectionInterval: 60,
                mode: FaceDetector.FaceDetectorMode.accurate,
                runClassifications: FaceDetector.FaceDetectorClassifications.all,
                tracking: true
            }}
        >
            <View style={styles.camtainer}>
                <Icon style={currentElement === 'orientation' ? [styles.icon, styles.selectedIcon] : styles.icon}
                    name={orientation === 'portrait' ? 'phone-landscape-outline' : 'phone-portrait-outline'} />
                <Text style={[styles.icon, { fontSize: 45 }]}>{blink}</Text>
                <Icon style={currentElement === 'photo' ? [styles.icon, styles.selectedIcon] : styles.icon} name='camera-outline' />
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
        fontSize: 27,
        textAlign: 'center'
    },
    selectedIcon: {
        color: '#ffe203',
        fontSize: 42
    },
    preview: {
        opacity: 0
    }
});
