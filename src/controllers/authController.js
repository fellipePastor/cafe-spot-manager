import { createUser, UserTypes } from '../models/User';
import { clearSession, getUsers, saveUsers, setSession } from '../storage/storage';
import { isValidEmail, requiredFieldsFilled } from '../utils/validators';

export const registerUser = async (payload) => {
  if (!requiredFieldsFilled([payload.name, payload.email, payload.password])) {
    throw new Error('Preencha todos os campos.');
  }

  if (!isValidEmail(payload.email)) {
    throw new Error('E-mail invalido.');
  }

  if (String(payload.password || '').length < 4) {
    throw new Error('A senha deve ter pelo menos 4 caracteres.');
  }

  const users = await getUsers();
  const exists = users.find((u) => u.email === payload.email.toLowerCase());
  if (exists) {
    throw new Error('Ja existe um usuario com este e-mail.');
  }

  const newUser = createUser({ ...payload, type: UserTypes.CLIENT });
  await saveUsers([...users, newUser]);
  await setSession(newUser);
  return newUser;
};

export const loginUser = async (email, password) => {
  if (!requiredFieldsFilled([email, password])) {
    throw new Error('Informe e-mail e senha.');
  }

  const users = await getUsers();
  const found = users.find(
    (u) => u.email === String(email || '').toLowerCase() && u.password === String(password || '')
  );

  if (!found) {
    throw new Error('Usuario ou senha incorretos.');
  }

  await setSession(found);
  return found;
};

export const logoutUser = async () => {
  await clearSession();
};
