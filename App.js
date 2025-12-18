import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { loginUser, registerUser, logoutUser } from './src/controllers/authController';
import { getSession, seedDefaults } from './src/storage/storage';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      await seedDefaults();
      const session = await getSession();
      setUser(session);
      setLoading(false);
    };
    bootstrap();
  }, []);

  const handleLogin = async (email, password) => {
    const logged = await loginUser(email, password);
    setUser(logged);
  };

  const handleSignup = async (payload) => {
    const created = await registerUser(payload);
    setUser(created);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#a855f7" size="large" />
      </View>
    );
  }

  return (
    <>
      <AppNavigator user={user} onLogin={handleLogin} onSignup={handleSignup} onLogout={handleLogout} />
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1220',
  },
});
