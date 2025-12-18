import { createCafe } from '../models/Cafe';
import { getCafes, saveCafes } from '../storage/storage';
import { isValidCnpj, requiredFieldsFilled } from '../utils/validators';

export const listCafes = async () => getCafes();
export const getCafeById = async (id) => {
  const cafes = await getCafes();
  return cafes.find((c) => c.id === id);
};

export const saveCafe = async (payload) => {
  if (
    !requiredFieldsFilled([
      payload.name,
      payload.street,
      payload.number,
      payload.zip,
      payload.neighborhood,
      payload.city,
      payload.state,
      payload.latitude,
      payload.longitude,
      payload.cnpj,
      payload.averageTicket,
    ])
  ) {
    throw new Error('Preencha todos os campos obrigatorios.');
  }

  if (!isValidCnpj(payload.cnpj)) {
    throw new Error('CNPJ precisa ter 14 digitos.');
  }

  const cafes = await getCafes();
  const mappedCafe = createCafe(payload);
  const exists = cafes.find((c) => c.id === mappedCafe.id);

  let updated = [];
  if (exists) {
    updated = cafes.map((c) => (c.id === mappedCafe.id ? mappedCafe : c));
  } else {
    updated = [...cafes, mappedCafe];
  }

  await saveCafes(updated);
  return mappedCafe;
};

export const deleteCafe = async (id) => {
  const cafes = await getCafes();
  const filtered = cafes.filter((c) => c.id !== id);
  await saveCafes(filtered);
  return filtered;
};

export const toggleCafeStatus = async (id) => {
  const cafes = await getCafes();
  const updated = cafes.map((cafe) =>
    cafe.id === id ? { ...cafe, active: !cafe.active } : cafe
  );
  await saveCafes(updated);
  return updated.find((c) => c.id === id);
};

export const toggleLike = async (id, userId) => {
  const cafes = await getCafes();
  const updated = cafes.map((cafe) => {
    if (cafe.id !== id) return cafe;
    const likedBy = cafe.likedBy || [];
    const hasLiked = likedBy.includes(userId);
    const newLikedBy = hasLiked ? likedBy.filter((uid) => uid !== userId) : [...likedBy, userId];
    return { ...cafe, likedBy: newLikedBy };
  });
  await saveCafes(updated);
  return updated.find((c) => c.id === id);
};
