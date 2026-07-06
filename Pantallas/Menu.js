import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { EstrellasContext } from '../context/EstrellasContext';

export default function Menu({ navigation }) {

  const { estrellas } =
    useContext(EstrellasContext);

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Elige un Juego
      </Text>

      <Text style={styles.estrellas}>
        ⭐ {estrellas}
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate('Colores')}
      >
        <Text style={styles.texto}>
          🎨 Aprende los Colores
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate('Conteo')}
      >
        <Text style={styles.texto}>
          🔢 Cuenta los Animales
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate('Burbujas')}
      >
        <Text style={styles.texto}>
          🫧Explota las burbujas
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgb(160, 240, 236)'
  },

  titulo:{
    fontSize:30,
    marginBottom:20,
    fontWeight:'bold'
  },

  estrellas:{
    fontSize:26,
    marginBottom:30,
    fontWeight:'bold'
  },

  boton:{
    width:'80%',
    backgroundColor:'#4CAF50',
    padding:20,
    marginVertical:10,
    borderRadius:15
  },

  texto:{
    textAlign:'center',
    color:'white',
    fontSize:22,
    fontWeight:'bold'
  }

});