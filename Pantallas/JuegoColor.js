import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";

/* ================= COLORES ================= */
const ALL_COLORS = [
  { name: "Rojo", hex: "#EF4444" },
  { name: "Azul", hex: "#3B82F6" },
  { name: "Verde", hex: "#22C55E" },
  { name: "Amarillo", hex: "#EAB308" },
  { name: "Naranja", hex: "#F97316" },
  { name: "Morado", hex: "#A855F7" },
  { name: "Rosa", hex: "#EC4899" },
  { name: "Cian", hex: "#06B6D4" },
  { name: "Marrón", hex: "#92400E" },
  { name: "Gris", hex: "#6B7280" },
];

/* ================= LOGICA ================= */
function pickRound(excludeHex) {
  const pool = ALL_COLORS.filter((c) => c.hex !== excludeHex);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  const correct = shuffled[0];
  const options = [correct, ...shuffled.slice(1, 4)].sort(
    () => Math.random() - 0.5
  );

  return { correct, options };
}

const TOTAL_ROUNDS = 3;

export default function App() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState(() => pickRound());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [iconFeedback, setIconFeedback] = useState(null);

  const bgImage = require("../assets/Imagenes/background.png");

  /* ================= SIGUIENTE ================= */
  const advance = useCallback(() => {
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }

    setRoundIndex((r) => r + 1);
    setRound((prev) => pickRound(prev.correct.hex));
    setAnswered(false);
    setSelected(null);
    setIconFeedback(null);
  }, [roundIndex]);

  /* ================= RESPUESTA ================= */
  const handleAnswer = (opt) => {
    if (answered) return;

    setSelected(opt.hex);
    setAnswered(true);

    const correct = opt.hex === round.correct.hex;

    if (correct) {
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
      setIconFeedback("correct");
    } else {
      setStreak(0);
      setIconFeedback("wrong");
    }

    setTimeout(() => {
      advance();
    }, 800);
  };

  const restart = () => {
    setRoundIndex(0);
    setScore(0);
    setStreak(0);
    setRound(pickRound());
    setAnswered(false);
    setSelected(null);
    setIconFeedback(null);
    setGameOver(false);
    setStarted(true);
  };

  /* ================= START ================= */
  if (!started) {
    return (
      <ImageBackground source={bgImage} style={styles.bg}>
        <Text style={styles.title}>🎨 Identifica el Color</Text>

        <Pressable
          onPress={() => setStarted(true)}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? "#E9D5FF" : "white",
              transform: [{ scale: pressed ? 0.96 : 1 }],
              shadowColor: "#000",
              shadowOpacity: pressed ? 0.1 : 0.25,
              shadowRadius: 6,
              elevation: pressed ? 2 : 6,
            },
          ]}
        >
          <Text style={styles.buttonText}>¡Empezar!</Text>
        </Pressable>
      </ImageBackground>
    );
  }

  /* ================= GAME OVER ================= */
  if (gameOver) {
    const message =
      score >= 80 ? "🎉 ¡Felicidades!" : "💪 ¡Inténtalo de nuevo!";

    const subtitle =
      score >= 80
        ? "Lo hiciste excelente"
        : "Puedes mejorar tu puntuación";

    return (
      <ImageBackground source={bgImage} style={styles.bg}>
        <View style={styles.finalCard}>
          <Text style={styles.finalTitle}>{message}</Text>

          <Text style={styles.finalSubtitle}>{subtitle}</Text>

          <Text style={styles.finalScore}>{score}</Text>
          <Text style={styles.finalPts}>PUNTOS</Text>

          {/* REINTENTAR */}
          <Pressable
            onPress={restart}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: pressed ? "#E9D5FF" : "white",
                transform: [{ scale: pressed ? 0.96 : 1 }],
                shadowColor: "#000",
                shadowOpacity: pressed ? 0.1 : 0.25,
                shadowRadius: 6,
                elevation: pressed ? 2 : 6,
              },
            ]}
          >
            <Text style={styles.buttonText}>🔁 Reintentar</Text>
          </Pressable>

          {/* SALIR */}
          <Pressable
            onPress={() => {
              setStarted(false);
              setGameOver(false);
              setRoundIndex(0);
              setScore(0);
              setStreak(0);
              setSelected(null);
              setAnswered(false);
              setIconFeedback(null);
            }}
            style={({ pressed }) => [
              styles.exitButton,
              {
                backgroundColor: pressed ? "#111" : "#333",
                transform: [{ scale: pressed ? 0.96 : 1 }],
                shadowColor: "#000",
                shadowOpacity: pressed ? 0.1 : 0.25,
                shadowRadius: 6,
                elevation: pressed ? 2 : 6,
              },
            ]}
          >
            <Text style={styles.exitButtonText}>🚪 Salir al menú</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  /* ================= GAME ================= */
  return (
    <ImageBackground source={bgImage} style={styles.bg}>
      {/* SCORE */}
      <View style={styles.header}>
        <Text style={styles.scoreBig}>{score} pts</Text>
      </View>

      {/* COLOR BOX */}
      <View
        style={[
          styles.colorBox,
          {
            backgroundColor: round.correct.hex,
            borderWidth: 3,
            borderColor: "black",
          },
        ]}
      />

      {/* OPTIONS */}
      <View style={styles.grid}>
        {round.options.map((opt) => {
          const isCorrect = opt.hex === round.correct.hex;
          const isSelected = selected === opt.hex;

          let bg = "white";
          let textColor = opt.hex;

          if (answered) {
            if (isCorrect) {
              bg = "#22C55E";
              textColor = "white";
            } else if (isSelected && !isCorrect) {
              bg = "#EF4444";
              textColor = "white";
            } else {
              bg = "white";
              textColor = "#999";
            }
          }

          return (
            <Pressable
              key={opt.hex}
              onPress={() => handleAnswer(opt)}
              disabled={answered}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: bg,
                  borderWidth: 2,
                  borderColor: "black",
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: textColor,
                  fontWeight: "bold",
                  fontSize: 22,
                  textShadowColor: "black",
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}
              >
                {opt.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* FEEDBACK ICON */}
      {iconFeedback && (
        <View style={styles.overlay}>
          <Text
            style={[
              styles.iconBig,
              iconFeedback === "correct"
                ? { color: "#22C55E" }
                : { color: "#EF4444" },
            ]}
          >
            {iconFeedback === "correct" ? "✅" : "❌"}
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },

  button: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#6B21A8",
  },

  exitButton: {
    backgroundColor: "#333",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
  },

  exitButtonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },

  header: {
    position: "absolute",
    top: 50,
    width: "90%",
    alignItems: "flex-end",
  },

  scoreBig: {
    color: "black",
    fontSize: 26,
    fontWeight: "bold",
  },

  colorBox: {
    width: 220,
    height: 220,
    borderRadius: 25,
    marginBottom: 30,
  },

  grid: {
    width: "80%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  option: {
    width: "48%",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  iconBig: {
    fontSize: 120,
    fontWeight: "bold",
  },

  finalCard: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 25,
    alignItems: "center",
    width: "85%",
  },

  finalTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#6B21A8",
    textAlign: "center",
    marginBottom: 10,
  },

  finalSubtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },

  finalScore: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#000",
  },

  finalPts: {
    fontSize: 18,
    color: "#888",
    marginBottom: 20,
    letterSpacing: 2,
  },
});