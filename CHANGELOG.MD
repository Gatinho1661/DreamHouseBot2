# Log de mudanças

Todas as mudanças e ideias significativas serão documentadas nesse arquivo

- Adere a [Semantic Versioning](http://semver.org/).
- Baseado em [Keep a Changelog](http://keepachangelog.com/)

# Ideias futuras

### ✨ Adicionar

- nada ainda

### ⚡ Melhorar

- nada ainda

### ⛔ Remover

- nada ainda

### 🐛 Arrumar

- Remover `youtubeDL` no DisTube, já que é obsoleto, e trocar pelo `@distube/yt-dlp`

# 1.3.0 (03/05/2022)

### Reorganizar arquivos #80

### ✨ Adicionado

- Changelog
- Configs do VSCode

### ⚡ Melhorado

- Código do bot movido para a pasta `SRC`
- Código do bot refatorado com novas regras do `EsLint`
  - Recuo com `2` espaços
  - Limite de `105` caracteres em uma linha
- Usar `fast-glob` no modulo de comandos, igual ao de eventos
- Usar `fast-glob` no comando de recarregar comandos
