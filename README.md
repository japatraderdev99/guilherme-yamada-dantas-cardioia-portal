# FIAP - Faculdade de Informática e Administração Paulista

<p align="center"><a href="https://www.fiap.com.br/"><img src="assets/logo-fiap.png" alt="FIAP" width="40%"></a></p>

# CardioIA — Portal de cuidado

**Ir Além 1 · FIAP · Fase 2 — Inteligência Artificial e Machine Learning**

## Nome do grupo

CardioIA — Guilherme Yamada Dantas

## 👨‍🎓 Integrantes

| Integrante              | RM     |
| ----------------------- | ------ |
| Guilherme Yamada Dantas | 568506 |

## 📜 Descrição

Portal acadêmico em React + Vite para visualizar pacientes fictícios, organizar consultas e acompanhar métricas. Funciona inteiramente no navegador, sem servidor de autenticação ou dados clínicos reais. Não realiza diagnósticos ou recomendações médicas.

Repositório: [guilherme-yamada-dantas-cardioia-portal](https://github.com/japatraderdev99/guilherme-yamada-dantas-cardioia-portal).

## 🔧 Como executar o código

Requisitos: Node.js 22.12+ (linha 22), 24+ ou 26+ e npm. Na pasta do projeto:

```bash
npm ci
npm run dev
```

Abra o endereço impresso pelo Vite (normalmente http://127.0.0.1:5173; se a porta estiver ocupada, ele escolhe outra). Credenciais públicas de demonstração:

- E-mail: `demo@cardioia.local`
- Senha: `CardioIA2026!`

```bash
npm test
npm run build
npm run preview
```

A prévia do build usa http://127.0.0.1:4173. `dist/` contém o resultado da compilação. A navegação usa HashRouter (`/#/pacientes`), permitindo hospedagem estática sem regras de redirecionamento no servidor.

## O que demonstrar

1. Acesse `/#/pacientes` sem login: o portal apresenta o formulário de acesso.
2. Entre com a conta de demonstração e veja os seis pacientes e as métricas.
3. Busque um nome em Pacientes e teste uma busca sem resultado.
4. Em Agendamentos, escolha paciente, especialidade, data futura e horário. Confirme.
5. Volte ao painel para conferir a consulta e a contagem atualizada.
6. Recarregue a página: sessão e agendamento continuam disponíveis neste navegador.
7. Tente reservar a mesma especialidade ou o mesmo paciente no mesmo horário: a validação bloqueia o conflito.
8. Cancele uma consulta com confirmação e saia. As rotas protegidas voltam ao login.
9. Repita a navegação em largura móvel. Tabelas permitem rolagem horizontal sem cortar as informações.

## Requisitos e implementação

| Requisito                    | Implementação                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Context API e JWT fake       | `src/contexts/AuthContext.jsx`, `src/services/auth.js`; token de três segmentos, expiração de oito horas, persistência local |
| Rotas protegidas             | `src/components/ProtectedRoute.jsx` protege painel, pacientes e agenda                                                       |
| Dados locais simulados       | `src/data/patients.json`, serviço assíncrono `src/services/patients.js`                                                      |
| useState e useReducer        | Formulário usa useState; agenda usa useReducer no DataContext                                                                |
| useEffect e useContext       | Carregamento, persistência, expiração e consumo dos contextos                                                                |
| Dashboard                    | Pacientes cadastrados, consultas futuras e especialidades                                                                    |
| Componentização              | Pastas `src/contexts`, `src/components`, `src/services`, `src/pages`                                                         |
| CSS Modules e responsividade | `Layout.module.css`, `Pages.module.css`, navegação móvel e foco visível                                                      |
| Testes                       | Integração de login/logout, persistência, proteção de rotas, criação/cancelamento e regras de conflito                       |

## 📁 Estrutura de pastas

```text
src/
  components/    Layout e proteção de rotas
  contexts/      Autenticação e dados compartilhados
  data/          Pacientes fictícios em JSON
  pages/         Login, painel, pacientes, agendamentos
  services/      Autenticação fake, armazenamento e validação
  main.jsx       Rotas e composição da aplicação
  styles.css     Base tipográfica e controles
 tests/          Testes Vitest + Testing Library
```

## Limites da simulação

O JWT é **fictício, sem assinatura ou verificação criptográfica**. A senha é pública e visível no código. A proteção de rotas demonstra fluxo de interface, não controle de acesso seguro. Qualquer pessoa com acesso ao navegador pode modificar o armazenamento. Não inserir dados reais de pacientes, senhas reais ou informações pessoais.

Os agendamentos ficam no `localStorage` do navegador, compartilhados pela conta demonstrativa e sem sincronização entre dispositivos. Datas e horários usam o fuso local do navegador. O painel conta somente consultas futuras; a agenda preserva o histórico até o cancelamento. Cada especialidade representa uma agenda única, por isso dois pacientes não podem reservar a mesma especialidade no mesmo horário. Não há definição de duração de consulta neste protótipo.

Quando o armazenamento é bloqueado, o portal apresenta aviso e continua apenas em memória. Dados corrompidos são ignorados. Para reiniciar a demonstração, apague as chaves `cardioia.session.v1` e `cardioia.appointments.v1` no armazenamento do navegador.

## Vídeo e entrega

**Vídeo principal local:** [CardioIA-Portal-demonstracao-nativa.mp4](document/video/CardioIA-Portal-demonstracao-nativa.mp4), com **2min40s (159,83 s)**, H.264, 1920×1080 e legendas incorporadas, sem áudio. Usa a gravação nativa real da tela do Mac, desacelerada para leitura, seguida de complementos identificados sobre responsividade, código e limites. O login já havia sido feito quando a captura começou; o encerramento mostra logout e retorno ao acesso.

A margem preta esquerda foi removida; o pequeno corte inferior da captura original foi preservado, sem ocultar as ações centrais. A gravação original permanece intacta. [Metadados e timeline](document/video/metadata-nativa.json) e [legendas SRT](document/video/CardioIA-Portal-demonstracao-nativa.srt) acompanham o vídeo.

**Alternativa anterior:** [CardioIA-Portal-demonstracao.mp4](document/video/CardioIA-Portal-demonstracao.mp4), 3min05s, composição de capturas reais com explicações e trechos do código.

**Pendente de publicação pelo aluno:** revisar o vídeo, publicar no YouTube como **não listado** e inserir o link real nesta seção. O roteiro está em [ROTEIRO-VIDEO.md](ROTEIRO-VIDEO.md). O código está publicado no repositório público indicado acima. Falta o link real do YouTube.

## Verificação automática

A rotina `.github/workflows/validacao.yml` instala pelo lockfile, executa os sete testes, compila e confere a formatação em Linux/Node 22. Foi configurada para execução após publicação; nenhuma execução remota é presumida. Os mesmos comandos passaram localmente em 07/10/2026.

## 🗃 Histórico de lançamentos

- 1.0.0 — 07/10/2026: portal React, autenticação simulada, pacientes, consultas, dashboard, testes e demonstração.

## 📋 Licença

Organização adaptada do [template FIAP](https://github.com/agodoi/templateFiapVfinal), com atribuição à FIAP sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Consulte [LICENSE](LICENSE).
