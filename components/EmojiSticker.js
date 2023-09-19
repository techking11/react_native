import { View, Image } from 'react-native';
import Animated from 'react-native-reanimated';

import { PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";

import {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);

const imageStyle = useAnimatedStyle(() => {
    return {
        width: withSpring(scaleImage.value),
        height: withSpring(scaleImage.value),
    };
});

const containerStyle = useAnimatedStyle(() => {
    return {
        transform: [
            {
                translateX: translateX.value,
            },
            {
                translateY: translateY.value,
            },
        ],
    };
});

const translateX = useSharedValue(0);
const translateY = useSharedValue(0);

const onDrag = useAnimatedGestureHandler({
    onStart: (event, context) => {
        context.translateX = translateX.value;
        context.translateY = translateY.value;
    },
    onActive: (event, context) => {
        translateX.value = event.translationX + context.translateX;
        translateY.value = event.translationY + context.translateY;
    },
});

export default function EmojiSticker({ imageSize, stickerSource }) {

    const scaleImage = useSharedValue(imageSize);

    const onDoubleTap = useAnimatedGestureHandler({
        onActive: () => {
            if (scaleImage.value !== imageSize * 2) {
                scaleImage.value = scaleImage.value * 2;
            }
        },
    });

    return (
        <PanGestureHandler onGestureEvent={onDrag}>
            <AnimatedView style={[containerStyle, { top: -350 }]}>
                <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
                    <AnimatedImage
                        source={stickerSource}
                        resizeMode="contain"
                        style={[imageStyle, { width: imageSize, height: imageSize }]}
                    />
                </TapGestureHandler>
            </AnimatedView>
        </PanGestureHandler>
    );
}