export const UserTypes = {
  CLIENT: 'Cliente',
  ADMIN: 'Admin',
};

export const createUser = ({ name, email, password, type }) => ({
  id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
  name: String(name || '').trim(),
  email: String(email || '').trim().toLowerCase(),
  password: String(password || ''),
  type: type || UserTypes.CLIENT,
});
