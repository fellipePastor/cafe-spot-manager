import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { toggleLike } from '../../controllers/cafeController';

const CafeDetailScreen = ({ route, user }) => {
  const initialCafe = route?.params?.cafe;
  const [cafe, setCafe] = useState(initialCafe);

  if (!cafe) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.error}>Cadastro nao encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={
            cafe.imageUrl
              ? { uri: cafe.imageUrl }
              : require('../../../assets/coffee-placeholder.jpg')
          }
          style={styles.hero}
        />
        <Text style={styles.title}>{cafe.name}</Text>
        <Text style={styles.subtitle}>{cafe.description}</Text>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Endereco</Text>
          <Text style={styles.text}>
            {cafe.address.street}, {cafe.address.number} - {cafe.address.neighborhood}
          </Text>
          <Text style={styles.text}>
            {cafe.address.city} / {cafe.address.state} • CEP {cafe.address.zip}
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Dados</Text>
          <Text style={styles.text}>CNPJ: {cafe.cnpj}</Text>
          <Text style={styles.text}>Latitude: {cafe.location.latitude}</Text>
          <Text style={styles.text}>Longitude: {cafe.location.longitude}</Text>
          <Text style={styles.text}>Ticket medio: {cafe.averageTicket}</Text>
          <Text style={styles.status}>{cafe.active ? 'Ativa' : 'Inativa'}</Text>
          <Text style={styles.text}>{cafe.likedBy?.length || 0} likes</Text>
          {user ? (
            <TouchableOpacity
              style={[styles.likeButton, cafe.likedBy?.includes(user.id) ? styles.likeButtonActive : null]}
              onPress={async () => {
                const updated = await toggleLike(cafe.id, user.id);
                setCafe(updated);
              }}
            >
              <Text style={[styles.likeText, cafe.likedBy?.includes(user.id) ? styles.likeTextActive : null]}>
                {cafe.likedBy?.includes(user.id) ? 'Remover like' : 'Curtir'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1220' },
  container: { padding: 16, gap: 12 },
  hero: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#cbd5e1', fontSize: 16 },
  block: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  blockTitle: { color: '#c084fc', fontWeight: '800', marginBottom: 6 },
  text: { color: '#e2e8f0', marginBottom: 4 },
  status: {
    marginTop: 8,
    color: '#38bdf8',
    fontWeight: '800',
  },
  likeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
  },
  likeButtonActive: {
    backgroundColor: '#c084fc',
    borderColor: '#c084fc',
  },
  likeText: { color: '#e2e8f0', fontWeight: '700' },
  likeTextActive: { color: '#0b1220' },
  error: { color: '#fb7185', fontWeight: '700' },
});

export default CafeDetailScreen;
