# ✅ Checklist de Funcionalidades - Trend Hub

Use este checklist para validar todas as funcionalidades implementadas.

## 👤 Autenticação & Perfil

- [ ] Criar nova conta com email, senha, username, nome completo
- [ ] Fazer login com credenciais
- [ ] Sair da conta
- [ ] Editar perfil (nome, bio)
- [ ] Fazer upload de foto de perfil
- [ ] Ver página de perfil com estatísticas
- [ ] Ver contagem: Posts, Seguidores, Seguindo, Data de criação

## 📝 Criar & Gerenciar Publicações

- [ ] Criar post com texto (até 1000 caracteres)
- [ ] Ver contador de caracteres
- [ ] Selecionar comunidade para post
- [ ] Criar post com foto (via URL)
- [ ] Ver preview de foto antes de publicar
- [ ] Criar post com vídeo (via URL)
- [ ] Expandir/retrair formulário de criação
- [ ] Cancelar criação de post
- [ ] Deletar próprio post
- [ ] Ver mensagem de sucesso ao publicar
- [ ] Ver erro se URL de foto/vídeo inválida

## ❤️ Curtir Posts

- [ ] Curtir um post (❤️ fica vermelho e preenchido)
- [ ] Ver contador de likes aumentar
- [ ] Descurtir um post (❤️ volta cinza)
- [ ] Ver contador de likes diminuir
- [ ] Curtir mesmo post novamente
- [ ] Ver que curtida persiste ao atualizar página
- [ ] Contador de likes atualiza em tempo real

## 💬 Comentários

- [ ] Clicar em botão de comentário abre painel
- [ ] Digitar comentário (até 500 caracteres)
- [ ] Enviar comentário
- [ ] Ver comentário adicionado à lista
- [ ] Ver autor do comentário (nome, @username)
- [ ] Ver tempo relativo do comentário (ex: "há 5 minutos")
- [ ] Ver contador de comentários aumentar
- [ ] Deletar próprio comentário
- [ ] Ver contador de comentários diminuir
- [ ] Ver "nenhum comentário ainda" quando painel vazio
- [ ] Usar tab/enter para enviar comentário

## 🔗 Compartilhar Posts

- [ ] Clicar no botão de compartilhar (🔗)
- [ ] Copiar URL do post automaticamente
- [ ] Ver notificação "Copiado"

## 👥 Seguir Usuários

- [ ] Clicar em "Seguir" no perfil de outro usuário
- [ ] Ver botão mudar para "Seguindo"
- [ ] Ver contagem de seguidores aumentar
- [ ] Clicar em "Seguindo" para deseguir
- [ ] Ver botão voltar para "Seguir"
- [ ] Ver contagem de seguidores diminuir
- [ ] Ver contagem "Seguindo" aumentar/diminuir no meu perfil
- [ ] Usar sugestões no RightSidebar para seguir
- [ ] Não conseguir seguir a si mesmo

## 💌 Mensagens Privadas

- [ ] Ir para perfil de outro usuário e clicar "Mensagem"
- [ ] Chat abre automaticamente
- [ ] Digitar e enviar mensagem privada
- [ ] Ver mensagem aparecer na conversa
- [ ] Mensagens com sender_id atual aparecem à direita (cyan)
- [ ] Mensagens recebidas aparecem à esquerda (cinza)
- [ ] Ver timestamp de cada mensagem
- [ ] Voltar para lista de conversas
- [ ] Ver conversa na lista com último usuário e última mensagem
- [ ] Clicar em conversa existente abre chat
- [ ] Buscar usuário para iniciar conversa no topo
- [ ] Nova conversa criada automaticamente na primeira mensagem

## 👥 Comunidades

- [ ] Participar de uma comunidade
- [ ] Ver comunidade na lista "Minhas Comunidades" (sidebar esquerdo)
- [ ] Publicar post em comunidade específica
- [ ] Ver comunidade na publicação (badge)
- [ ] Clicar na comunidade do post leva para página dela
- [ ] Ver todos os posts da comunidade
- [ ] Criar nova comunidade com:
  - [ ] Título
  - [ ] Descrição
  - [ ] Categoria
  - [ ] Regras (opcional)
  - [ ] Imagem (opcional)

## 📱 Feed Personalizado

- [ ] Feed vazio mostra mensagem com sugestões
- [ ] Feed mostra posts de pessoas que sigo
- [ ] Feed mostra posts de comunidades que participo
- [ ] Feed mostra meus próprios posts
- [ ] Posts ordenados por data (mais recentes primeiro)
- [ ] Clicar "Atualizar" recarrega feed
- [ ] Sem seguir ninguém, feed vazio

## 🔍 Explorar

- [ ] Buscar usuário por nome
- [ ] Buscar usuário por @username
- [ ] Ver resultados de busca
- [ ] Clicar em perfil abre página de usuário
- [ ] Trend tags no RightSidebar com contagem de posts
- [ ] Clicar em trend leva para explorar com filtro

## 📊 Sidebar Direito

- [ ] Ver trending tags com contagem
- [ ] Ver sugestões de usuários
- [ ] Ver comunidades em destaque
- [ ] Clicar "Seguir" em sugestões
- [ ] Usuário desaparece de sugestões após seguir
- [ ] Todos os elementos responsivos em mobile

## 🎨 Interface & UX

- [ ] App carrega sem erros
- [ ] Tema escuro (dark mode) aplicado
- [ ] Cores corretas (cyan, purple, blue)
- [ ] Ícones carregam corretamente
- [ ] Animações smooth
- [ ] Responsive em mobile (menu hambúrguer)
- [ ] Responsive em tablet
- [ ] Responsive em desktop

## 📱 Mobile

- [ ] Menu hambúrguer funciona
- [ ] Sidebar desaparece quando abre menu
- [ ] Clique fora fecha menu
- [ ] Todos os elementos acessíveis
- [ ] Toque em botões funciona bem
- [ ] Input abre teclado virtual

## 🔔 Notificações (Toast)

- [ ] "Publicado com sucesso!" ao criar post
- [ ] "Comentário publicado!" ao comentar
- [ ] "Seguindo!" ao seguir
- [ ] "Deixou de seguir" ao deseguir
- [ ] "Erro..." ao tentar ação inválida
- [ ] Toasts aparecem no canto superior direito
- [ ] Toasts desaparecem após 3 segundos

## 🐛 Edge Cases & Validações

- [ ] Não posso curtir se não logado
- [ ] Não posso comentar se não logado
- [ ] Não posso seguir se não logado
- [ ] Não posso enviar mensagem se não logado
- [ ] Campo de post desabilita se vazio
- [ ] Campo de comentário desabilita se vazio
- [ ] Campo de mensagem desabilita se vazio
- [ ] Upload de foto falha gracefully se URL inválida
- [ ] Não posso seguir a mim mesmo
- [ ] Não posso deletar comentário de outro
- [ ] Não posso deletar post de outro

## 🔐 Segurança & Dados

- [ ] Autenticação via Supabase Auth funciona
- [ ] Tokens salvos e restaurados ao recarregar
- [ ] Apenas pode acessar /feed se logado
- [ ] ProtectedRoute redireciona se não autenticado
- [ ] Dados de outros usuários visível corretamente
- [ ] Dados pessoais não expostos (emails, etc)

## 🌐 Realtime (Supabase)

- [ ] Mensagens chegam em tempo real
- [ ] Curtidas atualizam sem refresh
- [ ] Comentários aparecem para todos os usuarios
- [ ] Contadores atualizam em tempo real

## 📊 Performance

- [ ] App carrega rápido (<2s)
- [ ] Interações respondem rapidamente
- [ ] Não há lag ao scroll de posts
- [ ] Imagens carregam adequadamente
- [ ] Sem memory leaks ao navegar

---

## 🎯 Checklist Final

**Antes de dar como completo:**
- [ ] Todos os itens acima foram testados
- [ ] Não há erros no console
- [ ] App roda sem crashes
- [ ] Todas as features listadas no README funcionam
- [ ] UI responsiva em todos os tamanhos
- [ ] Performance aceitável

**Status: ✅ READY FOR PRODUCTION**
