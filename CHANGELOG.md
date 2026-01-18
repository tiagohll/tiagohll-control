# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-01-18

### Adicionado

- **Motor de Análise IA:** Integração com Groq Cloud utilizando o modelo `Llama 3.1 8B` para geração de insights automáticos.
- **Resumo Inteligente:** Nova aba de "Resumo IA" que processa eventos de tráfego e cliques em tempo real.
- **Interface "Shimmer" Animada:** Botão de IA com borda infinita giratória em gradiente azul, inspirado no design moderno de interfaces de Inteligência Artificial.
- **Prompt de Engenharia:** Implementação de sistema de filtragem de tokens para reduzir custos e evitar limites de taxa (Rate Limits).

### Melhorado

- **Performance de API:** Redução do payload de eventos enviado para a IA através de simplificação de chaves JSON (minificação de dados de contexto).
- **Estabilidade de Conexão:** Tratamento de erro robusto para o status `429 (Rate Limit)` e `500`, evitando o estado de carregamento infinito no dashboard.
- **Experiência do Usuário (UX):** Transições suaves entre as abas de cliques, acessos e resumo utilizando Framer Motion.

### Corrigido

- **Loop de Carregamento:** Correção do bug onde o componente de análise não liberava o estado de "loading" quando a API da Groq retornava erro.

## [1.2.4] - 2026-01-14

### Corrigido

- **Melhora na UI de Cliques:** Agora a UI esta igual o restando do sistema
- **Metodo de salvar os hash de cliques:** vistor_hash no banco de dados irá ser o campo utilizado para salvar o nome do clique

## [1.2.4] - 2026-01-14

### Corrigido

- **Melhora na UI de Cliques:** Agora a UI esta igual o restando do sistema
- **Metodo de salvar os hash de cliques:** vistor_hash no banco de dados irá ser o campo utilizado para salvar o nome do clique

## [1.2.2] - 2026-01-14

### Corrigido

- **Filtro de periodos:** Agora você filtra os dados de forma correta.

## [1.2.1] - 2026-01-14

### Adicionado

- **Resumo do sistema v.1.1:** Agora o resumo do sistema realmente analise da instruções.

## [1.2.0] - 2026-01-14

### Adicionado

- **Refatoração do DeatailsClient:** O arquivo principal agora e somente um "cérebro" de dados, movendo toda a loga de processamento de allEvents para os components.
- **Componentização Modular:** Criamos componentes independentes para as visualizações de dados, reduzindo a complexidade do arquivo principal e prevenindo erros de Hydration ao gerenciar melhor o estado no cliente.
- **Resumo do sistema:** Foi adicionado um sistema que resume todos os dados do site facilitando para o cliente visualizar o que realmente acontece e quais sao as metricas.
- **Cliques track:** Agora o sistema coleta os cliques do usuario.

### Corrigido

- Erros de digitacão na página de documentação.

## [1.1.0] - 2026-01-11

### Adicionado

- **Documentação de CSP(DOCS)**: Instruções detalhadas para configuração da diretiva connect-src no arquivo next.config.js.
- **Guia de Variáveis de Ambiente(DOCS)**: Seção dedicada à configuração do .env.local para URLs de rastreio e IDs de projeto.
- **Diferenciais de Produto(DOCS)**: Documentação sobre os benefícios de privacidade, performance (sem impacto em LCP/TBT) e rastreamento nativo de QR Codes/UTMs.
- **Alertas de Segurança(DOCS)**: Aviso sobre o uso de variáveis NEXT*PUBLIC* e o risco de exposição de chaves secretas no navegador.

### Corrigido

- Erro de Hidratação (React Hydration Error): Correção de aninhamento inválido de tags HTML onde o componente <ReactMarkdown> estava sendo renderizado dentro de uma tag <p> no arquivo src/app/docs/page.tsx.

- Conectividade de API: Ajuste na configuração de cabeçalhos de segurança para permitir requisições de logs e visualizações de página para o domínio tiagohll-control.vercel.app.

## [1.0.0] - 2026-01-08

### Adicionado

- **Dashboard de Analytics**: Visualização em tempo real de acessos totais, acessos do dia e páginas mais visitadas.
- **Gerador de QR Code Inteligente**: Sistema para gerar QR Codes com parâmetros UTM automáticos (`utm_source` e `utm_medium`) para rastreamento de origem física.
- **Download de Ativos**: Funcionalidade para baixar o QR Code gerado diretamente em formato PNG.
- **Personalização de Marca**: Opção para inserir URL de logo customizada no centro do QR Code para clientes da agência.
- **Auto-Refresh**: Atualização automática dos dados do dashboard a cada 15 segundos sem necessidade de recarregar a página.
- **Filtros de Origem**: Seção de análise específica para desempenho de escaneamentos de QR Code.
- **Página 404**: Página de erro personalizada com a identidade visual do THLL Control.
- **Sistema de Autenticação**: Integração com login para controle de acesso aos dashboards.

### Corrigido

- Erro de CSP (Content Security Policy) ao carregar imagens de logos externos no QR Code.
- Duplicidade de prefixos no rastreamento de eventos `event_type` no banco de dados.
- Cache de dados estáticos no Next.js forçando atualização dinâmica (Realtime simulation).

### Segurança

- Implementação de rotas protegidas e integração com Supabase Auth.
