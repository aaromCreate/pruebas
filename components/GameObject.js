import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";

// Diccionario de imágenes indexadas por tipo de insecto
const images = {
    ladybug: require("../assets/Imagenes/ladybug.png"),
    ant: require("../assets/Imagenes/ant.png"),
    worm: require("../assets/Imagenes/worm.png"),
};

const GameObject = React.memo(function GameObject({
    type,
    centerX,
    centerY,
    found,
    visible = true,
    size = 35, // 🌟 Recibe el tamaño aleatorio (usa 35 como valor de respaldo)
}) {
    
    // Si el objeto no debe ser visible, no renderizamos nada en el árbol de vistas
    if (!visible) return null;

    // Control preventivo por si se pasa un tipo de insecto inexistente en el JSON de niveles
    const imageSource = images[type];
    if (!imageSource) {
        console.warn(`El insecto de tipo "${type}" no tiene una imagen registrada en GameObject.js`);
        return null;
    }

    return (
        <Image
            source={imageSource}
            style={[
                styles.object,
                {
                    width: size,              // 📐 Tamaño dinámico aleatorio
                    height: size,             // 📐 Tamaño dinámico aleatorio
                    left: centerX - size / 2, // 🎯 Centrado matemático perfecto exacto
                    top: centerY - size / 2,  // 🎯 Centrado matemático perfecto exacto
                    opacity: found ? 0.3 : 1, // Feedback visual semi-transparente al ser contado
                },
            ]}
            contentFit="contain"
        />
    );
});

const styles = StyleSheet.create({
    object: {
        position: "absolute", // Necesario para posicionar mediante coordenadas X e Y relativas
    },
});

export default GameObject;