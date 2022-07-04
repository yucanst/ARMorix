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
            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='camera-outline' onPress={() => selectType('back')} />
                <Text style={styles.text}>Scenery</Text>
            </View>

            <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='camera-reverse-outline' onPress={() => selectType('front')} />
                <Text style={styles.text}>Selfie</Text>
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
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center'
    },

    // Type
    iconContainer: {
        alignItems: 'center',
        textAlign: 'center',
        paddingBottom: 30
    },
    icon: {
        fontSize: 66
    },
    text: {
        fontSize: 18
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
