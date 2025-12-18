export const UserTypes = {
  CLIENT: 'Cliente',
  ADMIN: 'Admin',
};

export const createUser = ({ name, email, password, type }) => ({
  id: Date.now().toString(),
  name: String(name || '').trim(),
  email: String(email || '').trim().toLowerCase(),
  password: String(password || ''),
  type: type || UserTypes.CLIENT,
});
