import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function Garden({
    source,
    onSizeChange,
    onPositionChange,
    children,
}) {

    function handleLayout(event) {

    const {
        width,
        height,
        x,
        y
    } = event.nativeEvent.layout;

    onSizeChange({
        width,
        height
    });

    if (onPositionChange) {
        onPositionChange({
            x,
            y
        });
    }
}

    return (
        <View
            style={styles.container}
            onLayout={handleLayout}
        >
            <Image
                source={source}
                style={styles.garden}
                contentFit="fill"
            />

            {children}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        position: "relative",
    },

    garden: {
        width: "100%",
        height: "100%",
    },
});