import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser, UserTypes } from '../models/User';
import { createCafe } from '../models/Cafe';

const USERS_KEY = '@cafe_spot_users';
const CAFES_KEY = '@cafe_spot_cafes';
const SESSION_KEY = '@cafe_spot_session';

const parseJSON = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Erro ao ler dados do storage', error);
    return null;
  }
};

export const getUsers = async () => parseJSON(await AsyncStorage.getItem(USERS_KEY)) || [];
export const saveUsers = async (users) => AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

export const getCafes = async () => parseJSON(await AsyncStorage.getItem(CAFES_KEY)) || [];
export const saveCafes = async (cafes) => AsyncStorage.setItem(CAFES_KEY, JSON.stringify(cafes));

export const getSession = async () => parseJSON(await AsyncStorage.getItem(SESSION_KEY));
export const setSession = async (user) => AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
export const clearSession = async () => AsyncStorage.removeItem(SESSION_KEY);

export const seedDefaults = async () => {
  const existingUsers = await getUsers();
  if (!existingUsers.length) {
    const admin = createUser({
      name: 'Admin Cafespot',
      email: 'admin@cafespot.com',
      password: '123456',
      type: UserTypes.ADMIN,
    });
    await saveUsers([admin]);
  }

  const existingCafes = await getCafes();
  if (!existingCafes.length) {
    const defaultCafes = [
      createCafe({
        name: 'Lua Alta Cafe',
        description: 'Torrefacao autoral com graos locais e doces artesanais.',
        street: 'Rua Paraiba',
        number: '120',
        zip: '30110-012',
        neighborhood: 'Savassi',
        city: 'Belo Horizonte',
        state: 'MG',
        latitude: '-19.9372',
        longitude: '-43.9329',
        cnpj: '12.345.678/0001-90',
        averageTicket: 'R$ 28',
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',
        likedBy: [],
      }),
      createCafe({
        name: 'Brisa Cafe Lab',
        description: 'Cold brew, musica indie e mesas colaborativas.',
        street: 'Av. Paulista',
        number: '1400',
        zip: '01310-100',
        neighborhood: 'Bela Vista',
        city: 'Sao Paulo',
        state: 'SP',
        latitude: '-23.5614',
        longitude: '-46.6560',
        cnpj: '98.765.432/0001-01',
        averageTicket: 'R$ 32',
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200',
        likedBy: [],
      }),
    ];
    await saveCafes(defaultCafes);
  }
};
