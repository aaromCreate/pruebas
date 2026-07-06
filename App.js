if (__DEV__) {
  global._IS_FABRIC = false;
}
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Inicio from './Pantallas/Inicio';
import Menu from './Pantallas/Menu';
import JuegoColor from './Pantallas/JuegoColor';
import JuegoContar from './Pantallas/JuegoContar';
import JuegoBurbujas from './Pantallas/JuegoBurbuja';

import { EstrellasProvider } from './context/EstrellasContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
     <GestureHandlerRootView style={{ flex: 1 }}>
    <EstrellasProvider>

      <NavigationContainer>

        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen
            name="Inicio"
            component={Inicio}
          />

          <Stack.Screen
            name="Menu"
            component={Menu}
          />

          <Stack.Screen
            name="Colores"
            component={JuegoColor}
          />

          <Stack.Screen
            name="Conteo"
            component={JuegoContar}
          />

          <Stack.Screen
            name="Burbujas"
            component={JuegoBurbujas}
          />

        </Stack.Navigator>

      </NavigationContainer>

    </EstrellasProvider>
    </GestureHandlerRootView>
  );
}