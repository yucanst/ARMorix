import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AutoFocus, Camera, CameraType, FlashMode } from 'expo-camera';

let camType = CameraType.back
let imageURI = ''

// Component to select front/back camera
function Type({ navigation }) {
    function selectType(type) {
        if (type === 'front') {
            camType = CameraType.front
        } else {
            camType = CameraType.back
        }

        navigation.navigate('Orientation')
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
}

// Component that contains camera features
function Application({ navigation }) {
    const [permission, setPermission] = useState(false);
    const [flash, setFlash] = useState(FlashMode.off)
    const [zoom, setZoom] = useState(0)

    const cam = useRef();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted');
        })();
    }, []);

    async function captureImage() {
        const options = { quality: 1, skipProcessing: false }

        try {
            const image = await cam.current.takePictureAsync(options);
            imageURI = image.uri;
            navigation.navigate('Review')
        } catch (err) {
            console.log(err);
        }
    }

    if (permission === false) {
        return <Text>No access to camera</Text>;
    } else {
        return (
            <View style={{ flex: 1 }}>
                <Camera
                    style={{ flex: 1 }}
                    type={camType}
                    ref={cam}
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
            </View>
        )
    }
}

// Component to review image
function Review({ navigation }) {
    function share() {
        // Instagram API
    }

    function retake() {
        // Return to camera screen (?)
    }

    function save() {
        // Save to phone gallery
        navigation.navigate('Type');
    }

    return (
        <View style={styles.reviewContainer}>
            <Icon style={styles.social} name='share-social-outline' />
            <Image style={{ width: 150, height: 300 }} source={{ uri: imageURI }} />
            <View style={styles.buttonContainer}>
                <Button title="Save Photo" color="#212121" onPress={() => save()} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Retake Photo" color="#212121" onPress={() => retake()} />
            </View>
        </View>
    )
}

export { Type, Application, Review }
const styles = StyleSheet.create({
    // Type
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
        border: '1px solid black',
        borderRadius: 30,
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
    reviewContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1
    },
    social: {
        alignSelf: 'flex-end',
        fontSize: 30,
        marginBottom: 30,
        marginRight: 25,
        marginTop: 15
    },
    buttonContainer: {
        marginTop: 15
    }
});
