import { Instagram, Heart, MessageCircle, ExternalLink, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';
import BrandLogo from './BrandLogo';

interface BlogSectionProps {
  posts: any[]; // Keep the prop signature for backward compatibility
}

export default function BlogSection({ posts }: BlogSectionProps) {
  // Retrieve customized Instagram integration details from localStorage if they exist
  const instagramHandle = localStorage.getItem('franriib_instagram_handle') || 'franriib.lab';
  const instagramUrl = localStorage.getItem('franriib_instagram_url') || 'https://www.instagram.com/franriib.lab';

  // Curated list of simulated Instagram posts for Franriib Lab
  const instagramFeed = [
    {
      id: 'ig-1',
      imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400',
      caption: 'Nosso icônico Porta-Caneta Pirulito Nuvem saindo do forno! 🍭☁️ Cada detalhe geométrico foi projetado para trazer leveza e organização à sua mesa de trabalho. Qual sua combinação favorita? #franriib #design3d',
      likes: 245,
      comments: 18,
      date: 'Há 2 dias',
    },
    {
      id: 'ig-2',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
      caption: 'Os bastidores do fatiamento e da deposição em PLA biodegradável premium. Camadas ultrafinas de 0.16mm garantem um toque suave e contornos impecáveis. ✨🛠️ #impressao3d #creativeworkspace',
      likes: 189,
      comments: 12,
      date: 'Há 5 dias',
    },
    {
      id: 'ig-3',
      imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=400',
      caption: 'Tons pasteis que abraçam o olhar. 🌸🌿 Do Rosa Cetim ao Verde Sálvia, selecionamos cores autorais que conversam entre si para criar ambientes harmônicos. Escolha seu kit no link da bio! #palette',
      likes: 312,
      comments: 29,
      date: 'Há 1 semana',
    },
    {
      id: 'ig-4',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
      caption: 'Organizadores Empilháveis Franriib: 4 camadas de pura versatilidade geométrica. Eles rotacionam em torno do próprio eixo para criar formas esculturais enquanto organizam seus pertences. 📐💎 #decor',
      likes: 204,
      comments: 14,
      date: 'Há 1 semana',
    },
    {
      id: 'ig-5',
      imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=400',
      caption: 'Organizador Modular Colmeia pronto para envio! 🍯🐝 Três copos hexagonais integrados que facilitam sua rotina criativa com estética minimalista e futurista. #desksetup #organization',
      likes: 167,
      comments: 9,
      date: 'Há 2 semanas',
    },
    {
      id: 'ig-6',
      imageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=400',
      caption: 'Embalagem afetiva: cada caixa que sai da Franriib Lab é acompanhada de uma tag exclusiva com o lote e tempo exato de impressão da sua peça. Feito à mão e com carinho! 📦💝 #artesanal',
      likes: 298,
      comments: 22,
      date: 'Há 3 semanas',
    },
  ];

  const handleRedirectToInstagram = () => {
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto" id="instagram-blog-container">
      
      {/* Blog Intro Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-block px-3 py-1 bg-[#D48C8C]/10 text-[#D48C8C] border border-[#D48C8C]/20 text-[10px] font-mono uppercase tracking-widest rounded-full">
          Novidades & Bastidores
        </span>
        <h2 className="text-2xl font-sans font-medium text-[#2E3A46] tracking-tight">Nosso Canal no Instagram</h2>
        <p className="text-xs text-gray-500 font-sans">
          Migramos todas as nossas novidades, lançamentos de peças, dicas de paletas e interações de estúdio diretamente para o nosso perfil oficial. Siga-nos para acompanhar em tempo real!
        </p>
      </div>

      {/* Styled Instagram Header Card */}
      <div className="bg-white border border-[#E9E3D9] rounded-3xl p-6 md:p-8 shadow-sm text-left">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          
          {/* Simulated Profile Picture (Elegant Layered Icon) */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF4D8D] via-[#D48C8C] to-[#8A9BB4] rounded-full p-[2.5px]" />
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white p-1 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#FAF6F0] flex items-center justify-center border border-[#E9E3D9] overflow-hidden">
                <BrandLogo type="icon" className="w-14 h-14" />
              </div>
            </div>
          </div>

          {/* Profile Metadata */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center md:justify-start">
              <h3 className="text-lg font-mono font-bold text-[#2E3A46] tracking-tight">
                {instagramHandle}
              </h3>
              
              <div className="flex items-center gap-1.5 justify-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#FAF6F0] border border-[#E9E3D9] text-[9px] font-mono text-gray-500 uppercase">
                  ✓ Verificado
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#D48C8C]/15 text-[#D48C8C] text-[9px] font-mono uppercase">
                  Estúdio de Design
                </span>
              </div>
            </div>

            {/* Instagram statistics numbers */}
            <div className="flex justify-center md:justify-start gap-6 md:gap-8 text-xs font-mono text-[#2E3A46]">
              <div>
                <strong className="text-sm font-semibold">4</strong> publicações
              </div>
              <div>
                <strong className="text-sm font-semibold">1.240</strong> seguidores
              </div>
              <div>
                <strong className="text-sm font-semibold">45</strong> seguindo
              </div>
            </div>

            {/* Profile Bio */}
            <div className="space-y-1 font-sans text-xs text-gray-600 leading-relaxed max-w-lg">
              <p className="font-semibold text-gray-800">Franriib Lab | Design & 3D</p>
              <p>🌱 Fatiando ideias e injetando cores pastel elegantes na sua mesa.</p>
              <p>📐 Peças de design feitas com PLA biodegradável e fatiamento ultra-fino (0.16mm).</p>
              <p className="text-[#8E9A86] font-mono text-[10px]">📍 Enviando carinho em camadas para todo o Brasil.</p>
            </div>

            {/* Follow Call to Action Button */}
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={handleRedirectToInstagram}
                id="btn-ig-follow"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF4D8D] to-[#D48C8C] hover:from-[#e03d7b] hover:to-[#c27c7c] text-white text-xs font-mono uppercase tracking-wider rounded-xl font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
                Seguir no Instagram
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={handleRedirectToInstagram}
                id="btn-ig-send-dm"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF6F0] hover:bg-[#E9E3D9]/50 text-[#2E3A46] border border-[#E9E3D9] text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Curated Instagram Photo Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9E3D9] pb-3 px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8E9A86] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD43A]" />
            Feed de Publicações
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            @franriib.lab
          </span>
        </div>

        {/* 3-column post grid (looks exactly like Instagram) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {instagramFeed.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={handleRedirectToInstagram}
              className="group bg-white border border-[#E9E3D9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              id={`ig-card-${post.id}`}
            >
              {/* Card Image with overlay */}
              <div className="aspect-square w-full bg-[#FAF6F0] relative overflow-hidden border-b border-[#FAF6F0]">
                <img
                  src={post.imageUrl}
                  alt={post.id}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Simulated Glassmorphic Instagram hover statistics overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm font-mono">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>

              {/* Feed Card Details */}
              <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                <p className="text-[11px] text-gray-600 leading-relaxed font-sans line-clamp-3">
                  <strong className="text-gray-800 mr-1">franriib.lab</strong>
                  {post.caption}
                </p>

                <div className="pt-2 border-t border-[#FAF6F0]/80 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span>{post.date}</span>
                  <span className="text-[#D48C8C] flex items-center gap-1 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Abrir <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="bg-[#FAF6F0] border border-[#E9E3D9] rounded-2xl p-6 text-center space-y-3">
        <Award className="w-8 h-8 text-[#D48C8C] mx-auto" />
        <h4 className="text-sm font-sans font-medium text-[#2E3A46]">Dúvidas ou Pedidos Customizados?</h4>
        <p className="text-xs text-gray-500 font-sans max-w-md mx-auto">
          Mande uma mensagem direta no nosso Instagram! Respondemos rápido sobre cores exclusivas, novos tamanhos de peças e orçamentos de atacado.
        </p>
        <button
          onClick={handleRedirectToInstagram}
          id="btn-ig-bottom-cta"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E3A46] hover:bg-[#D48C8C] text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
        >
          Conversar via Instagram DM
        </button>
      </div>

    </div>
  );
}
