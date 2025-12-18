import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';

const LoginScreen = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.decor} />
        <View style={styles.container}>
          <Text style={styles.title}>CafeSpot</Text>
          <Text style={styles.subtitle}>Mapeie cafeterias artesanais e descubra lugares unicos.</Text>

          <View style={styles.form}>
            <TextInput
              placeholder="E-mail"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} />

            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              style={styles.linkContainer}
            >
              <Text style={styles.link}>Nao possui conta? Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      {loading ? <ActivityIndicator style={styles.loader} color="#a855f7" /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1220' },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  decor: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#1e3a8a',
    opacity: 0.18,
    top: -50,
    right: -60,
    transform: [{ rotate: '12deg' }],
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 10,
  },
  input: {
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 14,
  },
  error: {
    color: '#fb7185',
    marginBottom: 10,
    fontWeight: '600',
  },
  linkContainer: { marginTop: 12, alignItems: 'center' },
  link: { color: '#a855f7', fontWeight: '700' },
  loader: { position: 'absolute', bottom: 32, alignSelf: 'center' },
});

export default LoginScreen;
