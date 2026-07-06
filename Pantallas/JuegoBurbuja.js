import React, {
  useState,
  useRef,
  useContext
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions
} from 'react-native';

import { EstrellasContext } from '../context/EstrellasContext';

const { width, height } = Dimensions.get('window');

function generarBurbuja() {
  return {
    id: Math.random().toString(),
    x: Math.random() * (width - 60),
    y: Math.random() * (height - 200),
    size: 40 + Math.random() * 30
  };
}

export default function JuegoBurbujas({ navigation }) {

  const {
    estrellas,
    agregarEstrella
  } = useContext(EstrellasContext);

  const [burbujas, setBurbujas] = useState([
    generarBurbuja(),
    generarBurbuja(),
    generarBurbuja(),
    generarBurbuja(),
    generarBurbuja()
  ]);

  const scaleAnim = useRef({}).current;

  function crearAnimacion(id) {
    if (!scaleAnim[id]) {
      scaleAnim[id] = new Animated.Value(1);
    }
    return scaleAnim[id];
  }

  function romperBurbuja(id) {

    agregarEstrella();

    Animated.timing(crearAnimacion(id), {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {

      setBurbujas(prev =>
        prev.filter(b => b.id !== id)
      );

      setBurbujas(prev => [
        ...prev,
        generarBurbuja()
      ]);

    });
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        🫧 ¡Explota las burbujas!
      </Text>

      <Text style={styles.estrellas}>
        ⭐ {estrellas}
      </Text>

      {burbujas.map(b => {
        const anim = crearAnimacion(b.id);

        return (
          <Animated.View
            key={b.id}
            style={[
              styles.burbuja,
              {
                width: b.size,
                height: b.size,
                left: b.x,
                top: b.y,
                transform: [{ scale: anim }]
              }
            ]}
          >
            <Pressable
              style={styles.press}
              onPress={() => romperBurbuja(b.id)}
            />
          </Animated.View>
        );
      })}

      <Pressable
        style={styles.volver}
        onPress={() => navigation.navigate('Menu')}
      >
        <Text style={styles.textoVolver}>
          ⬅ Volver al menú
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#E3F2FD'
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50
  },

  estrellas: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },

  burbuja: {
    position: 'absolute',
    backgroundColor: 'rgba(135,206,250,0.6)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },

  press: {
    flex: 1,
    width: '100%',
    height: '100%'
  },

  volver: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 12
  },

  textoVolver: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }

});