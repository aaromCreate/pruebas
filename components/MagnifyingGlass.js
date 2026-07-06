import React, { useRef } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

const TOTAL_SIZE = 170; // Tamaño completo de la estructura de la lupa (PNG)
const LENS_SIZE = 90;   // El espejo interno donde se ve el juego
const ZOOM = 1.5;       // Ajustado a 1.5 para que sea cómodo buscar

// 🎛️ Calibración de posición: Centrado físico del cristal respecto a tu lupa.png
const CRYSTAL_LEFT = 18;
const CRYSTAL_TOP = 15;

export default function MagnifyingGlass({ onMove, gardenSource, gardenSize, children }) {

// Ajusta estos valores (x, y) para mover toda la "ventana" inicial
const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({ x: pan.x._value, y: pan.y._value });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: (event, gestureState) => {
                pan.setValue({ x: gestureState.dx, y: gestureState.dy });

                // Calculamos el centro real de la lupa para la colisión de los bichos
const currentX =
    pan.x._value +
    pan.x._offset +
    CRYSTAL_LEFT +
    LENS_SIZE / 2;

const currentY =
    pan.y._value +
    pan.y._offset +
    CRYSTAL_TOP +
    LENS_SIZE / 2;

                onMove?.(currentX, currentY);
            },
            onPanResponderRelease: () => {
                pan.flattenOffset();
            }
        })
    ).current;

    const gWidth = gardenSize?.width || 1;
    const gHeight = gardenSize?.height || 1;

// 🔥 CORRECCIÓN CENTRALIZADA Y PROPORCIONAL
    // Usamos el centro de la lente (LENS_SIZE / 2) como ancla.
    // Calculamos el desplazamiento basándonos en cuánto se aleja la lupa del centro del jardín.
    
const translateX = Animated.add(
    Animated.multiply(
        Animated.add(pan.x, CRYSTAL_LEFT),
        -ZOOM
    ),
    new Animated.Value(LENS_SIZE / 2)
);

const translateY = Animated.add(
    Animated.multiply(
        Animated.add(pan.y, CRYSTAL_TOP),
        -ZOOM
    ),
    new Animated.Value(LENS_SIZE / 2)
);

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                { transform: pan.getTranslateTransform() },
            ]}
        >
            {/* 🔵 CRISTAL INTERNO (MÁSCARA DE RECORTE) */}
            <View style={[styles.crystal, { top: CRYSTAL_TOP, left: CRYSTAL_LEFT }]}>
                
                {/* 🌿 FONDO INTERNO S_C_A_L_E_D */}
                <Animated.Image
                    source={gardenSource}
                    style={[
                        styles.zoomedContent,
                        {
                            width: gWidth * ZOOM,
                            height: gHeight * ZOOM,
                            transform: [
                                { translateX: translateX },
                                { translateY: translateY }
                            ]
                        }
                    ]}
                    contentFit="cover"
                />
                
                {/* 🐜 INSECTOS CON ZOOM PERFECTAMENTE ALINEADOS */}
                <Animated.View 
                    style={[
                        styles.zoomedContent,
                        {
                            width: gWidth * ZOOM,
                            height: gHeight * ZOOM,
                            transform: [
                                { translateX: translateX },
                                { translateY: translateY }
                            ]
                        }
                    ]}
                >
                    {children}
                </Animated.View>
            </View>

            {/* 🔘 MARCO DE LA LUPA ENCIMA */}
            <Image
                source={require("../assets/Imagenes/lupa.png")}
                style={styles.border}
                contentFit="contain"
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: TOTAL_SIZE,
        height: TOTAL_SIZE,
        zIndex: 999,
    },
    crystal: {
        position: "absolute",
        width: LENS_SIZE,
        height: LENS_SIZE,
        borderRadius: LENS_SIZE / 2,
        overflow: "hidden",
        backgroundColor: "transparent",
    },
    zoomedContent: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    border: {
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
    },
});