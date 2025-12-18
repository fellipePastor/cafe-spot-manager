export const fetchAddressByCep = async (cep) => {
  const digits = String(cep || '').replace(/\D/g, '');
  if (digits.length !== 8) {
    throw new Error('CEP deve ter 8 digitos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!response.ok) {
    throw new Error('Falha ao buscar CEP. Tente novamente.');
  }

  const data = await response.json();
  if (data?.erro) {
    throw new Error('CEP nao encontrado.');
  }

  return {
    street: data.logradouro || '',
    neighborhood: data.bairro || '',
    city: data.localidade || '',
    state: data.uf || '',
    zip: data.cep || digits,
  };
};
