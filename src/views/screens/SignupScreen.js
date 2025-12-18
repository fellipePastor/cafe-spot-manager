import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import FormField from '../components/FormField';

const SignupScreen = ({ navigation, onSignup }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await onSignup(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crie sua conta</Text>

        <FormField
          label="Nome completo"
          placeholder="Ex.: Ana Luiza"
          value={form.name}
          onChangeText={(text) => updateField('name', text)}
          autoCapitalize="words"
        />
        <FormField
          label="E-mail"
          placeholder="email@exemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => updateField('email', text)}
        />
        <FormField
          label="Senha"
          placeholder="Minimo 4 caracteres"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => updateField('password', text)}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          title={loading ? 'Enviando...' : 'Cadastrar'}
          onPress={handleSignup}
          style={{ marginTop: 8 }}
        />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.linkText}>Ja possui conta? Fazer login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1220' },
  container: {
    padding: 24,
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#cbd5e1',
    marginBottom: 24,
  },
  error: {
    color: '#fb7185',
    marginBottom: 10,
    fontWeight: '600',
  },
  backLink: { alignItems: 'center', marginTop: 14 },
  linkText: { color: '#a855f7', fontWeight: '700' },
});

export default SignupScreen;
