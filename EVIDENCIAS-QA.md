# Evidências locais de validação

Data: 7 de outubro de 2026. Ambiente: Node.js 22.17.1, npm 10.9.2.

- `npm test`: **7 testes aprovados**, Vitest 5.0.3.
- `npm run build`: **aprovado**, Vite 6.4.4; 55 módulos transformados.
- Instalação final: auditoria npm reportou **0 vulnerabilidades**. Isso não constitui certificação de segurança do produto.
- Login no navegador real: formulário e entrada no painel confirmados pela árvore de acessibilidade; seis pacientes e zero consultas no estado inicial.

## Cobertura dos testes

1. Acesso sem sessão a pacientes redireciona ao login e não expõe a lista.
2. Credenciais inválidas e sessão expirada são rejeitadas.
3. Login, restauração após remontagem e logout funcionam.
4. JSON de sessão corrompido é ignorado.
5. Agendamento persiste, aparece no painel e restaura após remontagem; cancelamento exige confirmação e atualiza armazenamento.
6. Campos incompletos, datas passadas e conflitos de especialidade/paciente são bloqueados; horários independentes válidos são permitidos.
7. Lista de consultas corrompida é recuperada e busca inexistente apresenta estado vazio.

## Conferência de entrega

- [x] Código React + Vite e arquivos de dependências.
- [x] Dados locais fictícios e JWT fake.
- [x] Context API, Hooks, rotas protegidas e CSS Modules.
- [x] README com instalação, execução, limitações e integrante.
- [x] Roteiro do vídeo de até quatro minutos.
- [ ] Vídeo final revisado pelo aluno.
- [ ] Vídeo publicado no YouTube como não listado e link real inserido no README.
- [ ] Repositório público com o nome exigido.
- [ ] Conferência e envio pelo aluno na plataforma FIAP.

O servidor de desenvolvimento desta sessão encontrou 5173 e 5174 ocupadas e iniciou em **http://127.0.0.1:5175**. Em uma nova execução, consulte a porta impressa pelo Vite.

## Revisão visual e vídeo

A coordenação executou no navegador: login, lista de seis pacientes, criação de consulta de Ana Ribeiro em 09/10/2026 às 10h, persistência após recarregar, painel atualizado para uma consulta, cancelamento confirmado, logout e bloqueio da rota de pacientes. Também conferiu a interface em janela móvel. Capturas reais estão em `document/evidencias/`.

Vídeo local `document/video/CardioIA-Portal-demonstracao.mp4`: **185 segundos (3min05s), H.264, 1920×1080, 15 fps, 1.784.285 bytes**, verificado com ffprobe. Sem áudio, com legendas visíveis. É uma composição de capturas reais, não gravação contínua. Dez quadros foram revisados em folha de contato; títulos, capturas, legendas e trechos de código sem cortes de conteúdo. Um quadro foi extraído do MP4 para conferir o resultado codificado.

`document/video/metadata.json` registra duração e fontes de cada cena. `gerar_video.py` reproduz a composição no macOS com Pillow e ffmpeg. Publicação no YouTube e avaliação pelo aluno continuam pendentes.

## Vídeo nativo final — revisão de mídia

- Arquivo: `document/video/CardioIA-Portal-demonstracao-nativa.mp4`.
- Duração ffprobe: **159.833333 s**, abaixo do limite de 240 s; H.264, 1920×1080, 24 fps; sem faixa de áudio.
- Tamanho: 2004106 bytes. SHA-256: `9313b9f6f0126ba8857190e0cfd464cc5c21749f727a839ad8a0edfffe2fe3cc`.
- Fonte nativa do Mac: `Gravação de Tela 2026-10-07 às 00.47.52.mov`, preservada. SHA-256: `15cb2b230ee6bab6619011115629760547391af573df5676606d91b2e6238f93`.
- Edição: recorte da margem preta, desaceleração a 2/3, legendas incorporadas em faixa externa, remoção do áudio ambiente. Complementos mobile/código/limites explicitamente identificados.
- Conferidos: folha de contato do MP4 e quadro de código em resolução integral; textos legíveis e legendas sem sobreposição à interface. A captura original possui pequeno corte inferior, sem comprometer os fluxos principais. Não contém nova encenação de login, já feito antes do início.
- Evidências visuais: `document/video/nativa-qa/contato-final.jpg` e `codigo-final.png`. Timeline e hashes em `metadata-nativa.json`; SRT disponível.
- Publicação e revisão final pelo aluno permanecem pendentes.
