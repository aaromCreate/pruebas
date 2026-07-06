import { Audio } from "expo-av";

const soundFiles = {
    found: require("../assets/Sonidos/found.mp3"),
    win: require("../assets/Sonidos/win.mp3"),
};

export async function playSound(type) {
    try {
        // Creamos e iniciamos el sonido
        const { sound } = await Audio.Sound.createAsync(soundFiles[type]);
        
        // Configuramos para que se limpie automáticamente al terminar
        sound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.didJustFinish) {
                await sound.unloadAsync();
            }
        });

        await sound.playAsync();
    } catch (error) {
        console.warn("Error reproduciendo sonido:", error);
    }
}