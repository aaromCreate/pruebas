import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Inicio({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Imagen</Text>

      <Text style={styles.titulo}>
        Aprende Jugando
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate('Menu')}
      >
        <Text style={styles.textoBoton}>
          Comenzar
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
    backgroundColor:'#576166'
  },

  logo:{
    fontSize:120
  },

  titulo:{
    fontSize:32,
    fontWeight:'bold',
    marginBottom:40
  },

  boton:{
    backgroundColor:'#FF9800',
    padding:20,
    borderRadius:15
  },

  textoBoton:{
    color:'white',
    fontSize:24,
    fontWeight:'bold'
  }
});