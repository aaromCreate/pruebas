import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import Garden from "../components/Garden";
import GameObject from "../components/GameObject";
import MagnifyingGlass from "../components/MagnifyingGlass";

import { isNear } from "../utils/gameUtils";
import level1 from "../data/contar/level1";
import { playSound } from "../components/soundManager"; 
// Asegúrate de importar tu EstrellasContext si lo usas aquí:
import { EstrellasContext } from "../context/EstrellasContext";

const MIN_SIZE = 30;
const MAX_SIZE = 55;

export default function JuegoContar() {
    // ============================
    // ESTADOS
    // ============================
    const [gardenSize, setGardenSize] = useState({ width: 0, height: 0 });
    const [gardenPosition, setGardenPosition] = useState({ x: 0, y: 0 });
    const [objects, setObjects] = useState([]);
    const [options, setOptions] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    const totalAnimals = level1.objects.length;

    // ============================
    // INICIALIZACIÓN ALEATORIA (Efecto de Montaje)
    // ============================
    useEffect(() => {
        // 1. Posiciones y Tamaños Aleatorios para los insectos
        const randomized = level1.objects.map((item) => {
            const randomX = Math.random() * (0.85 - 0.15) + 0.15; // Rango 15% a 85% del jardín
            const randomY = Math.random() * (0.80 - 0.20) + 0.20; // Rango 20% a 80% del jardín
            const randomSize = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;

            return {
                ...item,
                x: randomX,
                y: randomY,
                size: randomSize, // Guardamos su tamaño propio
                found: false,
            };
        });
        setObjects(randomized);

        // 2. Generar opciones numéricas para los botones
        const opts = new Set();
        opts.add(totalAnimals);
        while (opts.size < 4) {
            const random = totalAnimals + Math.floor(Math.random() * 5 - 2);
            if (random > 0) opts.add(random);
        }
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    }, []);

    // ============================
    // DETECCIÓN DE COLISIONES (Eficiente a 60 FPS)
    // ============================
    const checkInsects = useCallback((lensX, lensY) => {
        if (gardenSize.width === 0 || gardenSize.height === 0) return;

        // Ajustamos la posición global de la lupa a las coordenadas locales del jardín
        const adjustedX = lensX - gardenPosition.x;
        const adjustedY = lensY - gardenPosition.y;

        setObjects((prev) => {
            let itemFound = false;

            const updated = prev.map((item) => {
                if (item.found) return item;

                const objectX = item.x * gardenSize.width;
                const objectY = item.y * gardenSize.height;

                // Margen dinámico: Radio lupa (85) + Radio propio del insecto (item.size / 2)
                const hitRadius = 85 + (item.size / 2);

                if (isNear(adjustedX, adjustedY, objectX, objectY, hitRadius)) {
                    itemFound = true;
                    playSound("found"); // Efecto de sonido inmediato sin congelar RAM
                    return { ...item, found: true };
                }
                return item;
            });

            return itemFound ? updated : prev;
        });
    }, [gardenSize, gardenPosition]);

    // ============================
    // CONTROL DE RESPUESTA
    // ============================
    function checkAnswer(selected) {
        const correct = selected === totalAnimals;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            playSound("win");
            // agregarEstrella(); // Descomenta si usas el contexto global
        }
    }

    return (
        <View style={styles.container}>
            {/* 🌿 ESCENARIO (JARDÍN BASE VACÍO) */}
            <Garden
                source={level1.background}
                onSizeChange={setGardenSize}
                onPositionChange={setGardenPosition}
            />

            {/* 🔍 LUPA (Muestra y magnifica los animales en su interior) */}
<MagnifyingGlass
    gardenSource={level1.background}
    gardenSize={gardenSize}          // ✨ Nueva prop enviada
    gardenPosition={gardenPosition}  // ✨ Nueva prop enviada
    onMove={checkInsects}
>
    {/* ... mapeo de tus GameObjects ... */}
</MagnifyingGlass>

            {/* 🎯 BOTONES DE OPCIONES */}
            <View style={styles.optionsContainer}>
                {options.map((opt, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.optionButton}
                        onPress={() => checkAnswer(opt)}
                    >
                        <Text style={styles.optionText}>{opt}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 🎉 MODAL DE RESPUESTA */}
            {showResult && (
                <View style={styles.modal}>
                    <Text style={styles.modalText}>
                        {isCorrect ? "🎉 ¡Excelente conteo!" : "❌ Intenta contar otra vez"}
                    </Text>
                    <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: isCorrect ? "#4CAF50" : "#2196F3" }]}
                        onPress={() => setShowResult(false)}
                    >
                        <Text style={styles.modalButtonText}>Continuar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    optionsContainer: {
        position: "absolute",
        bottom: 40,
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        zIndex: 1000,
    },
    optionButton: {
        width: "40%",
        margin: 8,
        padding: 16,
        backgroundColor: "#8BC34A",
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    optionText: {
        fontSize: 26,
        color: "white",
        fontWeight: "bold",
    },
    modal: {
        position: "absolute",
        top: "35%",
        left: "10%",
        right: "10%",
        backgroundColor: "white",
        padding: 30,
        borderRadius: 25,
        alignItems: "center",
        zIndex: 9999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalText: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    modalButton: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 15,
    },
    modalButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    }
});