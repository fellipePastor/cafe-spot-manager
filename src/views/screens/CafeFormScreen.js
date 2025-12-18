import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import FormField from '../components/FormField';
import { maskCnpj } from '../../utils/validators';
import { saveCafe } from '../../controllers/cafeController';
import { UserTypes } from '../../models/User';
import { fetchAddressByCep } from '../../services/cepService';

const emptyForm = {
  id: null,
  name: '',
  description: '',
  street: '',
  number: '',
  zip: '',
  neighborhood: '',
  city: '',
  state: '',
  latitude: '',
  longitude: '',
  cnpj: '',
  averageTicket: '',
  imageUrl: '',
  active: true,
};

const CafeFormScreen = ({ navigation, route, user }) => {
  const existingCafe = route?.params?.existingCafe;
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const lastCepRef = useRef('');

  useEffect(() => {
    if (user && user.type !== UserTypes.ADMIN) {
      Alert.alert('Acesso restrito', 'Apenas administradores podem cadastrar/editar cafeterias.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    if (existingCafe) {
      setForm({
        id: existingCafe.id,
        name: existingCafe.name,
        description: existingCafe.description,
        street: existingCafe.address.street,
        number: existingCafe.address.number,
        zip: existingCafe.address.zip,
        neighborhood: existingCafe.address.neighborhood,
        city: existingCafe.address.city,
        state: existingCafe.address.state,
        latitude: existingCafe.location.latitude,
        longitude: existingCafe.location.longitude,
        cnpj: existingCafe.cnpj,
        averageTicket: existingCafe.averageTicket,
        imageUrl: existingCafe.imageUrl,
        active: existingCafe.active,
      });
    }
  }, [existingCafe, user]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleCepLookup = async (value) => {
    const cepValue = value ?? form.zip;
    const digits = String(cepValue || '').replace(/\D/g, '');
    if (digits.length !== 8 || digits === lastCepRef.current) {
      return;
    }
    lastCepRef.current = digits;
    setError('');
    try {
      const address = await fetchAddressByCep(cepValue);
      setForm((prev) => ({
        ...prev,
        street: address.street || prev.street,
        neighborhood: address.neighborhood || prev.neighborhood,
        city: address.city || prev.city,
        state: address.state || prev.state,
        zip: address.zip || prev.zip,
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const digits = String(form.zip || '').replace(/\D/g, '');
    if (digits.length === 8 && digits !== lastCepRef.current) {
      handleCepLookup(form.zip);
    }
  }, [form.zip]);

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await saveCafe(form);
      navigation.navigate('CafeList', {
        flashMessage: existingCafe ? 'Cadastro atualizado com sucesso.' : 'Cafeteria cadastrada com sucesso.',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{existingCafe ? 'Editar cafeteria' : 'Nova cafeteria'}</Text>
        <Text style={styles.subtitle}>
          Campos obrigatorios para localizacao, CNPJ e ticket medio.
        </Text>

        <FormField
          label="Nome da cafeteria"
          placeholder="Ex.: Terra Bean Roasters"
          value={form.name}
          onChangeText={(text) => updateField('name', text)}
        />
        <FormField
          label="Descricao"
          placeholder="Breve descricao do conceito"
          value={form.description}
          onChangeText={(text) => updateField('description', text)}
        />

        <Text style={styles.sectionTitle}>Endereco</Text>
        
        <FormField
          label="CEP"
          placeholder="00000-000"
          value={form.zip}
          onChangeText={(text) => updateField('zip', text)}
          onEndEditing={(e) => handleCepLookup(e.nativeEvent.text)}
          onSubmitEditing={(e) => handleCepLookup(e.nativeEvent.text)}
          keyboardType="numeric"
          maxLength={9}
        />
        <FormField
          label="Rua"
          placeholder="Rua / Avenida"
          value={form.street}
          onChangeText={(text) => updateField('street', text)}
        />
        <FormField
          label="Numero"
          placeholder="120"
          value={form.number}
          onChangeText={(text) => updateField('number', text)}
        />
        <FormField
          label="Bairro"
          placeholder="Bairro"
          value={form.neighborhood}
          onChangeText={(text) => updateField('neighborhood', text)}
        />
        <View style={styles.row}>
          <FormField
            label="Cidade"
            placeholder="Cidade"
            value={form.city}
            onChangeText={(text) => updateField('city', text)}
            style={styles.half}
          />
          <FormField
            label="UF"
            placeholder="MG"
            maxLength={2}
            autoCapitalize="characters"
            value={form.state}
            onChangeText={(text) => updateField('state', text)}
            style={styles.half}
          />
        </View>

        <Text style={styles.sectionTitle}>Geolocalizacao</Text>
        <View style={styles.row}>
          <FormField
            label="Latitude"
            placeholder="-19.9321"
            value={form.latitude}
            keyboardType="numeric"
            onChangeText={(text) => updateField('latitude', text)}
            style={styles.half}
          />
          <FormField
            label="Longitude"
            placeholder="-43.9401"
            value={form.longitude}
            keyboardType="numeric"
            onChangeText={(text) => updateField('longitude', text)}
            style={styles.half}
          />
        </View>

        <FormField
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          value={form.cnpj}
          keyboardType="numeric"
          onChangeText={(text) => updateField('cnpj', maskCnpj(text))}
          hint="Mascara aplicada automaticamente"
        />
        <FormField
          label="Ticket medio / Preco"
          placeholder="Ex.: R$ 30"
          value={form.averageTicket}
          onChangeText={(text) => updateField('averageTicket', text)}
        />
        <FormField
          label="Imagem (URL opcional)"
          placeholder="https://..."
          value={form.imageUrl}
          autoCapitalize="none"
          onChangeText={(text) => updateField('imageUrl', text)}
          hint="Se vazio, sera usada a imagem padrao."
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          title={saving ? 'Salvando...' : 'Salvar cadastro'}
          onPress={handleSave}
          style={{ marginTop: 6, marginBottom: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1220' },
  container: { padding: 16 },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#cbd5e1', marginBottom: 16 },
  sectionTitle: { color: '#c084fc', fontWeight: '800', marginBottom: 10, marginTop: 12 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  error: { color: '#fb7185', fontWeight: '700', marginTop: 8 },
});

export default CafeFormScreen;
