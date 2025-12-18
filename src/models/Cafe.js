export const createCafe = (payload) => ({
  id: payload?.id || Date.now().toString(),
  name: String(payload?.name || '').trim(),
  description: String(payload?.description || '').trim(),
  address: {
    street: String(payload?.street || '').trim(),
    number: String(payload?.number || '').trim(),
    zip: String(payload?.zip || '').trim(),
    neighborhood: String(payload?.neighborhood || '').trim(),
    city: String(payload?.city || '').trim(),
    state: String(payload?.state || '').trim().toUpperCase(),
  },
  location: {
    latitude: String(payload?.latitude || '').trim(),
    longitude: String(payload?.longitude || '').trim(),
  },
  cnpj: String(payload?.cnpj || '').trim(),
  averageTicket: String(payload?.averageTicket || '').trim(),
  imageUrl: payload?.imageUrl || '',
  active: payload?.active ?? true,
  likedBy: payload?.likedBy || [],
});
