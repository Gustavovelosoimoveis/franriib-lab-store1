import { Product3D, BlogPost, FilamentStock, SEOMetadata } from '../types';

export const INITIAL_PRODUCTS: Product3D[] = [
  {
    id: 'lollipop-holder',
    name: 'Porta-Caneta Pirulito Nuvem',
    description: 'Inspirado na sua foto! Um porta-canetas lúdico e geométrico em formato de pirulito. Possui uma base confortável em formato de nuvem, uma flor decorativa e a esfera de encaixe perfeito para sua caneta touch, Apple Pencil ou caneta tradicional.',
    basePrice: 49.90,
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400',
    category: 'organizer',
    estimatedPrintTime: '3h 45m',
    dimensions: '12 x 12 x 16 cm',
    weightGrams: 115,
    customizableParts: {
      primaryLabel: 'Cor da Nuvem Base',
      secondaryLabel: 'Cor da Flor Intermediária',
      tertiaryLabel: 'Cor da Esfera do Pirulito',
      hasStick: true,
      stickLabel: 'Cor do Lápis/Caneta'
    }
  },
  {
    id: 'stacking-frames',
    name: 'Organizadores Empilháveis Franriib',
    description: 'Inspirado no lindo logotipo da Franriib Lab! Um organizador decorativo composto por 4 camadas de molduras quadradas arredondadas que rotacionam livremente. Ideal para organizar pequenos pertences ou servir de escultura de mesa interativa.',
    basePrice: 79.90,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
    category: 'decor',
    estimatedPrintTime: '5h 20m',
    dimensions: '10 x 10 x 12 cm',
    weightGrams: 160,
    customizableParts: {
      primaryLabel: 'Cor do Frame Base',
      secondaryLabel: 'Cor do Frame Central 1',
      tertiaryLabel: 'Cor do Frame Central 2',
      hasStick: true,
      stickLabel: 'Cor do Frame Topo'
    }
  },
  {
    id: 'ripple-vase',
    name: 'Vaso de Ondas Orgânicas',
    description: 'Um elegante vaso decorativo com textura ondulante criada por algoritmos de impressão 3D. Perfeito para flores secas ou plantas artificiais, acrescentando textura sofisticada e fluida ao seu ambiente de trabalho ou sala.',
    basePrice: 64.90,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=400',
    category: 'decor',
    estimatedPrintTime: '4h 10m',
    dimensions: '11 x 11 x 22 cm',
    weightGrams: 135,
    customizableParts: {
      primaryLabel: 'Cor do Corpo Ondulado',
      secondaryLabel: 'Cor do Gargalo Superior',
      tertiaryLabel: 'Cor do Anel de Base'
    }
  },
  {
    id: 'hex-organizer',
    name: 'Organizador Modular Colmeia',
    description: 'Organizador modular sextavado inspirado nas colmeias de abelhas. Três copinhos de alturas diferentes unidos por uma base sólida. Permite organizar clipes, canetas, borrachas e ferramentas com facilidade e estética futurista.',
    basePrice: 55.00,
    image: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=400',
    category: 'organizer',
    estimatedPrintTime: '4h 50m',
    dimensions: '14 x 13 x 11 cm',
    weightGrams: 125,
    customizableParts: {
      primaryLabel: 'Cor do Módulo Alto',
      secondaryLabel: 'Cor do Módulo Médio',
      tertiaryLabel: 'Cor do Módulo Baixo'
    }
  }
];

export const COLOR_PALETTE = [
  // Elegant Brand Pastels (From Logo)
  { name: 'Rosa Cetim', hex: '#DE9E9E', group: 'Logo Cores Delicadas' },
  { name: 'Verde Sálvia', hex: '#8E9A86', group: 'Logo Cores Delicadas' },
  { name: 'Azul Névoa', hex: '#8A9BB4', group: 'Logo Cores Delicadas' },
  { name: 'Terracota', hex: '#C68B75', group: 'Logo Cores Delicadas' },
  { name: 'Areia Suave', hex: '#FAF6F0', group: 'Logo Cores Delicadas' },
  { name: 'Amarelo Creme', hex: '#E5C299', group: 'Logo Cores Delicadas' },

  // Vibrant Pop Colors (From 3D product photo)
  { name: 'Rosa Pirulito', hex: '#FF4D8D', group: 'Vibrantes (Sua Foto)' },
  { name: 'Amarelo Flor', hex: '#FFD43A', group: 'Vibrantes (Sua Foto)' },
  { name: 'Azul Nuvem', hex: '#5DBDF6', group: 'Vibrantes (Sua Foto)' },
  { name: 'Verde Menta Pop', hex: '#37E2B0', group: 'Vibrantes (Sua Foto)' },

  // Premium Filaments
  { name: 'Preto Carbono', hex: '#222222', group: 'Clássicos' },
  { name: 'Branco Gesso', hex: '#F0ECE3', group: 'Clássicos' },
  { name: 'Prata Metalizado', hex: '#9E9E9E', group: 'Clássicos' },
  { name: 'Dourado Seda', hex: '#D4AF37', group: 'Clássicos' }
];

export const INITIAL_FILAMENT_STOCK: FilamentStock[] = [
  { id: 'pla-rosa-cetim', colorName: 'Rosa Cetim', colorHex: '#DE9E9E', gramsRemaining: 850, capacityGrams: 1000, pricePerGram: 0.15 },
  { id: 'pla-verde-salvia', colorName: 'Verde Sálvia', colorHex: '#8E9A86', gramsRemaining: 700, capacityGrams: 1000, pricePerGram: 0.15 },
  { id: 'pla-azul-nevoa', colorName: 'Azul Névoa', colorHex: '#8A9BB4', gramsRemaining: 920, capacityGrams: 1000, pricePerGram: 0.15 },
  { id: 'pla-terracota', colorName: 'Terracota', colorHex: '#C68B75', gramsRemaining: 450, capacityGrams: 1000, pricePerGram: 0.16 },
  { id: 'pla-rosa-pirulito', colorName: 'Rosa Pirulito', colorHex: '#FF4D8D', gramsRemaining: 900, capacityGrams: 1000, pricePerGram: 0.15 },
  { id: 'pla-amarelo-flor', colorName: 'Amarelo Flor', colorHex: '#FFD43A', gramsRemaining: 550, capacityGrams: 1000, pricePerGram: 0.15 },
  { id: 'pla-azul-nuvem', colorName: 'Azul Nuvem', colorHex: '#5DBDF6', gramsRemaining: 680, capacityGrams: 1000, pricePerGram: 0.15 },
  { id: 'pla-preto-carbono', colorName: 'Preto Carbono', colorHex: '#222222', gramsRemaining: 1200, capacityGrams: 1500, pricePerGram: 0.12 },
  { id: 'pla-dourado-seda', colorName: 'Dourado Seda', colorHex: '#D4AF37', gramsRemaining: 300, capacityGrams: 1000, pricePerGram: 0.18 }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Como escolhemos as cores do Franriib Lab? Descubra nossa paleta autoral',
    slug: 'como-escolhemos-paleta-franriib',
    excerpt: 'Criamos um ecossistema visual de tons pastel sofisticados que trazem harmonia e elegância para objetos funcionais. Saiba mais sobre a nossa pesquisa de design.',
    content: `A escolha das cores de um objeto impresso em 3D vai muito além do aspecto estético superficial. Ela dita a forma como a luz interage com as camadas depositadas, como o objeto se posiciona na arquitetura de um quarto ou escritório, e o sentimento de quem o manuseia.

No **Franriib Lab**, desenvolvemos uma identidade focada em duas vertentes:
1. **Paleta Muted Elegant (Pastel)**: Cores como o *Rosa Cetim*, *Verde Sálvia* e *Azul Névoa* trazem suavidade ao ambiente, minimizando a rigidez mecânica comum no 3D e transformando tecnologia em pura decoração acolhedora.
2. **Paleta Pop-Vibrant**: Elementos como o *Rosa Pirulito* e o *Amarelo Flor* (presentes em nosso icônico Porta-Caneta Nuvem) que acentuam a infância moderna e o prazer da personalização.

Neste artigo, mostramos como você pode combinar essas matizes para criar itens únicos que ganham forma no seu espaço decorativo!`,
    author: 'Francielle R.',
    coverImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400',
    category: 'Design & Cores',
    tags: ['Design', 'Paleta de Cores', 'Tendências'],
    createdAt: '2026-06-20',
    readTime: '4 min'
  },
  {
    id: 'post-2',
    title: 'Por trás das câmeras: O processo de impressão 3D em filamento PLA',
    slug: 'processo-impressao-pla-franriib',
    excerpt: 'Entenda como transformamos modelos digitais em produtos físicos altamente táteis e duráveis utilizando polímeros biodegradáveis de altíssima fidelidade.',
    content: `Cada peça que sai da Franriib Lab passa por um rito de produção cuidadoso:

1. **Fase de Modelagem & Co-criação**: O design 3D é gerado com foco em balanço, suportes mínimos e acabamento perfeito.
2. **Fatiamento Personalizado**: Convertemos as formas geométricas em trilhas de comandos. Configuramos a altura das camadas (0.16mm para extrema suavidade) e o preenchimento ideal para garantir rigidez sem desperdiçar material.
3. **Impressão 3D Inteligente**: Nossas impressoras depositam filamento PLA biodegradável camada por camada a 210°C.
4. **Pós-Processamento Artesanal**: Cada peça é inspecionada, rebarbas são eliminadas à mão e é aplicada a verificação de encaixe das partes coloridas.

Tudo isso garante um produto esteticamente superior e ecologicamente amigável, pronto para dar asas à sua imaginação.`,
    author: 'Equipe Franriib',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
    category: 'Bastidores',
    tags: ['Bastidores', 'Impressão 3D', 'Sustentabilidade'],
    createdAt: '2026-06-15',
    readTime: '6 min'
  }
];

export const DEFAULT_SEO_METADATA: SEOMetadata = {
  title: 'Franriib Lab - Design 3D que Ganha Forma',
  description: 'Personalize e compre incríveis produtos impressos em 3D. Porta-canetas pirulito, organizadores empilháveis e vasos geométricos com materiais biodegradáveis premium.',
  keywords: 'Franriib Lab, impressao 3d, design de produto, porta-caneta pirulito, organizador de mesa, decoracao minimalista, pla biodegradavel',
  googleAnalyticsId: 'G-FRANRIIB3D',
  sitemapEnabled: true
};
