"""Compõe capturas reais revisadas, sem representar gravação contínua. Requer Pillow e ffmpeg."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps
import subprocess,json,textwrap
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'document/video'
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
def font(n,bold=False):return ImageFont.truetype(BOLD if bold else FONT,n)
scenes=[
('login.png','CardioIA · Portal de cuidado','Guilherme Yamada Dantas · RM 568506. Ir Além 1: React + Vite. Demonstração composta de capturas reais; não é uma gravação contínua.',20),
('painel.png','Acesso e painel geral','O login de demonstração permite acessar as rotas protegidas. O painel inicia com seis pacientes fictícios e nenhuma consulta futura.',17),
('pacientes.png','Pacientes simulados','A listagem consome um arquivo JSON local por um serviço assíncrono. useEffect carrega os dados; useState controla a busca por nome.',17),
('formulario.png','Agendamento de consulta','Selecionamos Ana Ribeiro, Cardiologia, 09/10/2026 às 10h. useState controla os campos e a validação bloqueia datas passadas e conflitos.',19),
('agenda-persistida.png','Persistência confirmada','Consulta criada e preservada após recarregar a página. useReducer controla a agenda; useEffect salva cada alteração no localStorage.',18),
('painel-atualizado.png','Métricas atualizadas','O painel passa de zero para uma consulta futura e apresenta o atendimento criado. Context API compartilha os mesmos dados entre as páginas.',17),
('mobile.png','Interface responsiva','Navegação e formulário também foram conferidos em uma janela móvel. CSS Modules organiza os estilos; controles têm rótulos e foco visível.',17),
('confirmacao-cancelamento.png','Cancelamento e proteção de rotas','O cancelamento pede confirmação. No teste real, a consulta foi removida; após sair, a rota de pacientes redirecionou para o login.',18),
(None,'Hooks e Context API','Os trechos exibidos vêm do código entregue. AuthContext compartilha a sessão; DataContext centraliza estado e persistência da agenda.',22),
(None,'Validação e limites','Sete testes automatizados e build aprovados. Login é simulado, sem segurança real; pacientes são fictícios. O portal não realiza diagnóstico.',20),
]
code1='''// AuthContext.jsx: sessão compartilhada
const [session, setSession] = useState(loadSession);
export const useAuth = () => useContext(AuthContext);

// DataContext.jsx: agenda compartilhada
const [appointments, dispatch] = useReducer(
  appointmentsReducer, undefined,
  () => validAppointments(read(APPOINTMENTS_KEY, []))
);
useEffect(() => {
  setStorageError(!save(APPOINTMENTS_KEY, appointments));
}, [appointments]);'''
code2='''Verificação local

npm ci            Instala versões do package-lock.json
npm test          7 testes aprovados
npm run build     Build de produção aprovado
npm run dev       Inicia o portal local

Cobertura: login, logout, rotas protegidas,
persistência, criação, conflitos e cancelamento.

Próximos passos do aluno:
Publicar repositório e vídeo não listado;
inserir o link real no README e enviar à FIAP.'''
metadata=[]
for i,(name,title,caption,duration) in enumerate(scenes):
 im=Image.new('RGB',(1920,1080),'#f5f8fb');d=ImageDraw.Draw(im)
 d.rectangle((0,0,1920,88),fill='#123d50');d.text((48,23),title,font=font(34,True),fill='white')
 d.text((1710,29),f'{i+1:02d} / 10',font=font(24),fill='#b8d6e1')
 if name:
  shot=Image.open(ROOT/'document/evidencias'/name).convert('RGB');shot.thumbnail((1880,785));im.paste(shot,((1920-shot.width)//2,98+(785-shot.height)//2))
 else:
  d.rounded_rectangle((70,110,1850,880),radius=12,fill='white',outline='#d9e5eb',width=2)
  for n,line in enumerate((code1 if i==8 else code2).splitlines()):d.text((110,140+n*48),line,font=font(29),fill='#163e50')
 d.rectangle((0,908,1920,1080),fill='#123d50')
 for n,line in enumerate(textwrap.wrap(caption,100)):d.text((48,928+n*39),line,font=font(30),fill='white')
 d.text((48,1044),'Capturas reais da interface + legendas explicativas · Protótipo acadêmico',font=font(19),fill='#b8d6e1')
 file=OUT/'quadros'/f'{i+1:02d}.png';im.save(file);metadata.append({'quadro':file.name,'fonte':name or 'trechos de código e validação','titulo':title,'legenda':caption,'duracao_s':duration})
(OUT/'metadata.json').write_text(json.dumps({'natureza':'Sequência de capturas reais; não gravação contínua','duracao_s':sum(s[-1] for s in scenes),'resolucao':'1920x1080','audio':False,'cenas':metadata},ensure_ascii=False,indent=2))
concat=OUT/'quadros.ffconcat'
concat.write_text('ffconcat version 1.0\n'+''.join(f"file 'quadros/{i+1:02d}.png'\nduration {s[-1]}\n" for i,s in enumerate(scenes))+"file 'quadros/10.png'\n")
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-safe','0','-i',str(concat),'-t',str(sum(s[-1] for s in scenes)),'-vf','fps=15','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'CardioIA-Portal-demonstracao.mp4')],check=True)
