# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-08

### Adicionado

-   **Dashboard de Analytics**: Visualização em tempo real de acessos totais, acessos do dia e páginas mais visitadas.
-   **Gerador de QR Code Inteligente**: Sistema para gerar QR Codes com parâmetros UTM automáticos (`utm_source` e `utm_medium`) para rastreamento de origem física.
-   **Download de Ativos**: Funcionalidade para baixar o QR Code gerado diretamente em formato PNG.
-   **Personalização de Marca**: Opção para inserir URL de logo customizada no centro do QR Code para clientes da agência.
-   **Auto-Refresh**: Atualização automática dos dados do dashboard a cada 15 segundos sem necessidade de recarregar a página.
-   **Filtros de Origem**: Seção de análise específica para desempenho de escaneamentos de QR Code.
-   **Página 404**: Página de erro personalizada com a identidade visual do THLL Control.
-   **Sistema de Autenticação**: Integração com login para controle de acesso aos dashboards.

### Corrigido

-   Erro de CSP (Content Security Policy) ao carregar imagens de logos externos no QR Code.
-   Duplicidade de prefixos no rastreamento de eventos `event_type` no banco de dados.
-   Cache de dados estáticos no Next.js forçando atualização dinâmica (Realtime simulation).

### Segurança

-   Implementação de rotas protegidas e integração com Supabase Auth.
