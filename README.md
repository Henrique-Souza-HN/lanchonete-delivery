# Lanchonete Delivery - Site de Delivery

## Como usar o sistema

### Para clientes:
1. Abra o arquivo `index.html` no navegador
2. Navegue pelas categorias: Lanches, Extras, Bebidas, Doces
3. Adicione produtos ao carrinho clicando em "Adicionar"
4. Clique no ícone do carrinho para ver seu pedido
5. Clique em "Finalizar Pedido" para enviar via WhatsApp

### Para administrador (você):
1. No site principal, clique em "Admin" no menu
2. O painel administrativo abrirá onde você pode:
   - **Adicionar novos produtos**: Clique em "Adicionar Novo Produto"
   - **Editar produtos existentes**: Clique em "Editar" ao lado do produto
   - **Excluir produtos**: Clique em "Excluir" ao lado do produto
   - **Alterar informações**: Nome, descrição, preço e categoria

### Categorias disponíveis:
- **Lanches**: Hamburgers, sanduíches, etc.
- **Extras**: Batatas fritas, acompanhamentos, etc.
- **Bebidas**: Refrigerantes, sucos, etc.
- **Doces**: Sobremesas, doces, etc.

### Dados armazenados:
- Todos os produtos e informações são salvos no navegador (localStorage)
- Os dados permanecem mesmo após fechar o navegador
- Para limpar todos os dados, use Ctrl+Shift+Delete e limpe os dados do site

### Personalização rápida:
- **Alterar informações de contato**: Edite as informações na seção "Contato" no HTML
- **Alterar número do WhatsApp**: Mude o número na função `checkout()` no arquivo script.js
- **Alterar cores**: Modifique as variáveis CSS no arquivo styles.css

### Como abrir o site:
1. Clique duas vezes no arquivo `index.html`
2. Ou abra o navegador e arraste o arquivo `index.html` para a janela
3. O site funcionará localmente sem precisar de servidor

### Backup dos dados:
- Para fazer backup dos produtos, copie o conteúdo do localStorage do navegador
- Para restaurar, cole o conteúdo no localStorage

## Observações:
- O site não requer internet para funcionar (exceto pelo WhatsApp)
- Todos os dados são armazenados localmente
- Ideal para pequenas lanchonetes que precisam de um sistema simples
