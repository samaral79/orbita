# Órbita 🪐

Uma viagem interativa pelo espaço, feita só com HTML, CSS e JavaScript (Three.js).

- **Sistema Solar 3D** no início: planetas, luas com nome, Plutão e a cintura de asteroides. Clica num corpo para lá ir.
- **Via Láctea 3D** (`via-lactea.html`): galáxia espiral com ~150 mil estrelas, braços com nome e o "Estás aqui". Voa até à Terra ou a outros sistemas planetários conhecidos: Proxima Centauri, TRAPPIST-1, 55 Cancri, HR 8799 e Kepler-90.
- **27 missões** espaciais com filtros, cartões dos planetas e números.
- **PT / EN** com um clique.

## Correr localmente

```bash
python3 -m http.server 8765
```

e abre http://localhost:8765 (tem de ser por servidor, não por `file://`, por causa dos módulos JS).

## Publicar

É um site estático sem build: serve a pasta tal como está (Cloudflare Pages, GitHub Pages, Netlify…). O Three.js vem do jsDelivr e as fontes do Google Fonts.
