import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { deleteCafe, listCafes, toggleCafeStatus, toggleLike } from '../../controllers/cafeController';
import { UserTypes } from '../../models/User';

const CafeListScreen = ({ navigation, onLogout, user, route }) => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(route?.params?.flashMessage || '');
  const isAdmin = user?.type === UserTypes.ADMIN;

  const loadData = async () => {
    setLoading(true);
    const data = await listCafes();
    setCafes(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
      if (route?.params?.flashMessage) {
        setMessage(route.params.flashMessage);
        navigation.setParams({ flashMessage: null });
      }
    }, [route?.params?.flashMessage])
  );

  const confirmDelete = (id) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Deseja remover este cadastro de vez?');
      if (confirmed) {
        deleteCafe(id).then(() => {
          setMessage('Cadastro removido');
          loadData();
        });
      }
      return;
    }

    Alert.alert('Excluir', 'Deseja remover este cadastro de vez?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteCafe(id);
          setMessage('Cadastro removido');
          loadData();
        },
      },
    ]);
  };

  const handleToggle = async (id) => {
    const updated = await toggleCafeStatus(id);
    setCafes((prev) => prev.map((c) => (c.id === id ? { ...c, active: updated.active } : c)));
    setMessage(updated.active ? 'Cadastro reativado' : 'Cadastro inativado');
  };

  const handleLike = async (id) => {
    if (!user?.id) return;
    const updated = await toggleLike(id, user.id);
    setCafes((prev) => prev.map((c) => (c.id === id ? { ...c, likedBy: updated.likedBy } : c)));
    setMessage(updated.likedBy?.includes(user.id) ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.active && styles.cardInactive]}
      activeOpacity={0.9}
      onPress={() =>
        isAdmin
          ? navigation.navigate('CafeForm', { existingCafe: item })
          : navigation.navigate('CafeDetail', { cafe: item })
      }
    >
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require('../../../assets/coffee-placeholder.jpg')
        }
        style={styles.thumb}
      />
      <View style={{ flex: 1 }}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.averageTicket}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.meta}>
          {item.address.city} - {item.address.state} • {item.address.neighborhood}
        </Text>
        <Text style={styles.metaSmall}>
          CNPJ: {item.cnpj} | {item.location.latitude},{item.location.longitude}
        </Text>
        <View style={styles.likeRow}>
          <Text style={styles.likesCount}>{item.likedBy?.length || 0} likes</Text>
          <TouchableOpacity
            style={[
              styles.likeButton,
              item.likedBy?.includes(user?.id) ? styles.likeButtonActive : null,
            ]}
            onPress={() => handleLike(item.id)}
            disabled={!user}
          >
            <Text
              style={[
                styles.likeText,
                item.likedBy?.includes(user?.id) ? styles.likeTextActive : null,
              ]}
            >
              {item.likedBy?.includes(user?.id) ? 'Remover like' : 'Curtir'}
            </Text>
          </TouchableOpacity>
        </View>
        {isAdmin ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CafeForm', { existingCafe: item })}
              style={[styles.actionButton, styles.edit]}
            >
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleToggle(item.id)}
              style={[styles.actionButton, styles.inactive]}
            >
              <Text style={styles.actionText}>{item.active ? 'Inativar' : 'Reativar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmDelete(item.id)}
              style={[styles.actionButton, styles.delete]}
            >
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>CafeSpot</Text>
          <Text style={styles.subtitle}>
            Ola, {user?.name || 'visitante'} • {cafes.length} cadastros
          </Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {isAdmin ? (
        <PrimaryButton
          title="Cadastrar nova cafeteria"
          onPress={() => navigation.navigate('CafeForm')}
          style={{ marginHorizontal: 16 }}
        />
      ) : (
        <Text style={styles.notice}>Apenas administradores podem cadastrar/editar.</Text>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {loading ? (
        <ActivityIndicator color="#a855f7" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={cafes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum cadastro ainda. Crie o primeiro!</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1220' },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#f8fafc', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#cbd5e1' },
  logout: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoutText: { color: '#e2e8f0', fontWeight: '700' },
  list: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  cardInactive: {
    opacity: 0.65,
    backgroundColor: '#111827',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  price: { color: '#c084fc', fontWeight: '800' },
  description: { color: '#cbd5e1', marginTop: 4 },
  meta: { color: '#94a3b8', marginTop: 6, fontWeight: '600' },
  metaSmall: { color: '#64748b', marginTop: 4, fontSize: 12 },
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  likesCount: { color: '#cbd5e1', fontWeight: '700' },
  likeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: { color: '#0b1220', fontWeight: '700' },
  edit: { backgroundColor: '#c084fc' },
  inactive: { backgroundColor: '#38bdf8' },
  delete: { backgroundColor: '#fb7185' },
  empty: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginTop: 24,
  },
  message: {
    color: '#c084fc',
    marginHorizontal: 16,
    marginTop: 10,
    fontWeight: '700',
  },
  notice: {
    color: '#cbd5e1',
    marginHorizontal: 16,
    marginTop: 10,
  },
});

export default CafeListScreen;
