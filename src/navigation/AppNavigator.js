import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../views/screens/LoginScreen';
import SignupScreen from '../views/screens/SignupScreen';
import CafeListScreen from '../views/screens/CafeListScreen';
import CafeFormScreen from '../views/screens/CafeFormScreen';
import CafeDetailScreen from '../views/screens/CafeDetailScreen';

const Stack = createNativeStackNavigator();

const headerStyles = {
  headerStyle: { backgroundColor: '#0f172a' },
  headerTintColor: '#f8fafc',
  headerTitleStyle: { fontWeight: '700', color: '#f8fafc' },
};

const AppNavigator = ({ user, onLogin, onSignup, onLogout }) => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ ...headerStyles }}>
      {user ? (
        <>
          <Stack.Screen
            name="CafeList"
            options={{ title: 'Cafeterias artesanais' }}
          >
            {(props) => <CafeListScreen {...props} user={user} onLogout={onLogout} />}
          </Stack.Screen>
          <Stack.Screen
            name="CafeDetail"
            options={{ title: 'Detalhes da cafeteria' }}
          >
            {(props) => <CafeDetailScreen {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen
            name="CafeForm"
            options={({ route }) => ({
              title: route?.params?.existingCafe ? 'Editar cadastro' : 'Nova cafeteria',
            })}
          >
            {(props) => <CafeFormScreen {...props} user={user} />}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} onLogin={onLogin} />}
          </Stack.Screen>
          <Stack.Screen
            name="Signup"
            options={{ title: 'Criar conta' }}
          >
            {(props) => <SignupScreen {...props} onSignup={onSignup} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
