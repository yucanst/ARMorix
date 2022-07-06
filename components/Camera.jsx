import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AutoFocus, Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

let camType = CameraType.back;
let camOrientation = 'portrait';

// Component to select front/back camera
function Type({ navigation }) {
    function selectType(type) {
        if (type === 'front') {
            camType = CameraType.front;
        } else {
            camType = CameraType.back;
        }

        navigation.navigate('Orientation');
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.title}>Select your{'\n'}Camera</Text>
                <Text style={styles.description}>take the image in your{'\n'}desired camera mode!</Text>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => selectType('back')}>
                    <Icon style={{ fontSize: 66 }} name='camera-outline' />
                    <Text style={styles.label}>Scenery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconContainer} onPress={() => selectType('front')}>
                    <Icon style={{ fontSize: 66 }} name='camera-reverse-outline' />
                    <Text style={styles.label}>Selfie</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

// Component to select portrait/landscape mode
function Orientation({ navigation }) {
    function selectOrientation(orientation) {
        // Default orientation is portrait - send instructions to arm if user selects landscape (?)
        if (orientation === 'landscape') {
            camOrientation = 'landscape';
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

// Component that contains camera features
function Cam({ navigation }) {
    const cameraRef = useRef();
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(false);
    const [image, setImage] = useState();

    // Camera settings
    const [flash, setFlash] = useState(FlashMode.off)
    const [zoom, setZoom] = useState(0)

    useEffect(() => {
        (async () => {
            const camPermission = await Camera.requestCameraPermissionsAsync();
            const mlPermission = await MediaLibrary.requestPermissionsAsync();
            setCameraPermission(camPermission.status === 'granted');
            setMediaLibraryPermission(mlPermission.status === 'granted');
        })();
    }, []);

    if (!cameraPermission) {
        return <Text>Please allow camera permission in settings.</Text>;
    }

    async function captureImage() {
        const options = { quality: 1, skipProcessing: false }

        try {
            const newImage = await cameraRef.current.takePictureAsync(options);
            setImage(newImage);
        } catch (err) {
            console.log(err);
        }
    }

    // Review once image is captured
    if (image) {
        function shareImage() {
            // Instagram API
        }

        function saveImage() {
            try {
                MediaLibrary.saveToLibraryAsync(image.uri).then(() => {
                    setImage(undefined);
                })
            } catch (err) {
                console.log(err);
            }
        }

        return (
            <View style={styles.previewContainer}>
                <Icon style={styles.social} name='share-social-outline' />
                <Image style={styles.preview} source={{ uri: image.uri }} />
                {mediaLibraryPermission ? <Button title="Save" color="#212121" onPress={() => saveImage()} /> : undefined}
                <Button title="Retake" color="#212121" onPress={() => setImage(undefined)} />
            </View>
        )
    }

    return (
        <Camera
            style={{ flex: 1 }}
            type={camType}
            ref={cameraRef}
            autoFocus={AutoFocus.on}
            flashMode={flash}
            zoom={zoom}
        >
            <View style={{ backgroundColor: 'transparent', flex: 1, flexDirection: 'row', margin: 20 }}>
                <TouchableOpacity style={{ alignItems: 'center', alignSelf: 'flex-end' }}
                    onPress={() => captureImage()}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Capture</Text>
                </TouchableOpacity>
            </View>
        </Camera>
    )
};

export { Type, Orientation, Cam };

const styles = StyleSheet.create({
    // Type + Orientation
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
        marginBottom: 50,
        width: '80%'
    },
    label: {
        fontSize: 18,
        fontStyle: 'italic',
        paddingTop: 10
    },

    // Camera

    // Review
    previewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    },
    social: {
        alignSelf: 'flex-end',
        fontSize: 30,
        marginBottom: 30,
        marginRight: 25,
        marginTop: 15
    }
});
