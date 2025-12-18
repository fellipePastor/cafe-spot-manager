# CafeSpot Manager

App Expo/React Native (JavaScript) no estilo MVC para mapear cafeterias artesanais. Inclui login/signup, cadastro de cafeterias (admin), lista com editar/inativar/excluir (admin), detalhe/like (clientes), busca de CEP via ViaCEP e persistência em AsyncStorage.

## Requisitos
- Node 18+ (recomendado 20+ para evitar warnings de engine)
- Expo CLI via `npx expo ...`

## Instalação
```bash
cd cafe-spot-manager
npm install
```

## Rodar
- Mobile (Expo Go): `npm start` e escanear QR
- Web: `npm start -- --web`
- Limpar cache: `npm start -- --clear`

## Credenciais padrão
- Admin: `admin@cafespot.com` / `123456`
- Novos cadastros: sempre entram como cliente.

## Fluxos
- **Login/Signup**: email + senha (mín. 4). Não há cadastro de admin via UI.
- **Lista de cafeterias**:
  - Clientes: ver detalhes e curtir/remover like.
  - Admin: criar, editar, inativar/reativar, excluir; também pode curtir.
- **Cadastro/edição**:
  - CEP primeiro campo; ao completar 8 dígitos, busca ViaCEP e preenche endereço.
  - Campos: nome, descrição, endereço completo, lat/long, CNPJ (com máscara), ticket médio, imagem opcional.
  - Salva em AsyncStorage e volta à lista com mensagem de sucesso.

## Estrutura (MVC)
- `src/models`: `User`, `Cafe`
- `src/controllers`: `authController`, `cafeController`
- `src/storage`: AsyncStorage + seed inicial
- `src/services`: integrações (ex.: `cepService`/ViaCEP)
- `src/views`: componentes e telas (Login, Signup, Lista, Form, Detalhe)
- `src/navigation`: stack condicional por sessão
- `src/utils`: validações e máscara de CNPJ

## Observações
- Dados persistem localmente (AsyncStorage); sem backend.
- Alert de exclusão tem fallback `window.confirm` no web.