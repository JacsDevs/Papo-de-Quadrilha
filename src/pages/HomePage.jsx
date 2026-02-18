import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const WHATSAPP_NUMBER = '5599999999999'

const serviceItems = [
  {
    title: 'Lives e Transmissoes',
    text: 'Qualidade tecnica para o concurso nao parar, com imagem estavel e audio limpo do inicio ao fim.',
  },
  {
    title: 'Cobertura Audiovisual',
    text: 'Fotos, videos e reels com identidade junina para ampliar o alcance da sua quadrilha e dos patrocinadores.',
  },
  {
    title: 'Entrevistas e Bastidores',
    text: 'O lado humano de quem faz o espetaculo: direcao, marcadores, noivos, figurinistas e torcida.',
  },
]

const marketplaceHighlights = [
  { item: 'Vestido de luxo bordado', type: 'Venda', price: 'R$ 1.850', tone: 'hot' },
  { item: 'Chapeu de cangaceiro premium', type: 'Aluguel', price: 'R$ 180/dia', tone: 'sun' },
  { item: 'Kit aderecos de mao', type: 'Venda', price: 'R$ 350', tone: 'sky' },
  { item: 'Traje completo de noivos', type: 'Aluguel', price: 'R$ 620', tone: 'violet' },
]

const testimonials = [
  {
    quote:
      'A transmissao salvou nosso concurso. Organizacao elogiou o nivel da cobertura e a entrega foi rapida.',
    author: 'Presidencia - Quadrilha Estrela do Arraial',
  },
  {
    quote:
      'Os bastidores mostraram nosso trabalho de meses. A comunidade se conectou mais com a equipe inteira.',
    author: 'Marcadora - Junina Raio de Sol',
  },
  {
    quote:
      'Anunciamos os aderecos e fechamos quase tudo na mesma semana. O marketplace funciona de verdade.',
    author: 'Figurinista - Cia Brilho Matuto',
  },
]

const rehearsalCalendar = [
  { date: 'Sexta, 20h', place: 'Praca Central', event: 'Ensaio geral aberto' },
  { date: 'Sabado, 18h', place: 'Arena Junina', event: 'Concurso municipal' },
  { date: 'Domingo, 16h', place: 'Bairro Novo Horizonte', event: 'Mostra de quadrilhas' },
]

function makeWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export default function HomePage() {
  const { user } = useAuth()
  const [contactForm, setContactForm] = useState({
    name: '',
    eventType: '',
    date: '',
    city: '',
    details: '',
  })

  const handleContactField = (event) => {
    const { name, value } = event.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = (event) => {
    event.preventDefault()

    const message = [
      'Oi, equipe Papo de Quadrilha!',
      `Nome: ${contactForm.name || 'Nao informado'}`,
      `Tipo: ${contactForm.eventType || 'Nao informado'}`,
      `Data: ${contactForm.date || 'Nao informado'}`,
      `Cidade: ${contactForm.city || 'Nao informado'}`,
      `Detalhes: ${contactForm.details || 'Nao informado'}`,
    ].join('\n')

    window.open(makeWhatsAppLink(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <section className="home-hero">
        <video
          className="hero-video-bg"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.svg"
          aria-label="Melhores momentos das coberturas juninas"
        >
          <source src="/media/hero-junino.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
        <section className="hero-content">
          <span className="hero-pill">Cobertura no trecho durante o ano inteiro</span>
          <h2 className="home-headline">Onde o Sao Joao acontece o ano inteiro.</h2>
          <p className="panel-subtitle">Cobertura, divulgacao e marketplace junino.</p>
          <div className="button-row" style={{ marginTop: '1rem' }}>
            <a
              href={makeWhatsAppLink('Quero contratar cobertura para meu evento/ensaio.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button type="button" className="primary-button">
                Contrate nossa cobertura
              </button>
            </a>
            <Link to={user ? '/perfil' : '/login'}>
              <button type="button" className="secondary-button">
                Anuncie seu traje
              </button>
            </Link>
          </div>
        </section>
      </section>

      <section className="panel">
        <h2 className="panel-title">Quem somos</h2>
        <div className="about-grid">
          <p className="panel-subtitle">
            O Papo de Quadrilha nao apenas filma. A gente vive a cultura junina, acompanha ensaios,
            concursos e bastidores em cada etapa da temporada. Nosso objetivo e fortalecer o
            movimento com divulgacao profissional e oportunidades reais para grupos, artistas e
            fornecedores.
          </p>
          <div className="about-stats">
            <article className="about-stat-card">
              <strong>+120</strong>
              <span>coberturas no ultimo ciclo</span>
            </article>
            <article className="about-stat-card">
              <strong>+30k</strong>
              <span>pessoas alcancadas nas redes</span>
            </article>
            <article className="about-stat-card">
              <strong>365 dias</strong>
              <span>de conteudo junino</span>
            </article>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Nossos servicos</h2>
        <div className="service-grid">
          {serviceItems.map((service) => (
            <article key={service.title} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="market-header">
          <div>
            <h2 className="panel-title">Marketplace junino</h2>
            <p className="panel-subtitle">
              Venda e aluguel de trajes, aderecos e pecas especiais em um so lugar.
            </p>
          </div>
          <Link to="/anuncios">
            <button type="button" className="ghost-button">
              Ver todos os anuncios
            </button>
          </Link>
        </div>

        <div className="market-carousel" aria-label="Destaques do marketplace">
          {marketplaceHighlights.map((highlight) => (
            <article key={highlight.item} className="market-card">
              <div className={`market-thumb ${highlight.tone}`} />
              <h3>{highlight.item}</h3>
              <p>{highlight.type}</p>
              <strong>{highlight.price}</strong>
            </article>
          ))}
        </div>

        <div className="market-categories">
          <span>Trajes de Noivos</span>
          <span>Destaques</span>
          <span>Aderecos de Mao</span>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Area do cliente / contato rapido</h2>
        <div className="split-layout">
          <div className="stack">
            <p className="panel-subtitle">
              Escolha sua intencao e fale com a equipe sem friccao.
            </p>
            <div className="quick-actions">
              <a
                href={makeWhatsAppLink('Quero contratar cobertura para meu evento/ensaio.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button type="button" className="primary-button">
                  Quero contratar cobertura
                </button>
              </a>
              <a
                href={makeWhatsAppLink('Quero anunciar um traje ou acessorio.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button type="button" className="secondary-button">
                  Quero anunciar um traje
                </button>
              </a>
              <a
                href={makeWhatsAppLink('Tenho duvidas gerais sobre os servicos.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button type="button" className="ghost-button">
                  Duvidas gerais
                </button>
              </a>
            </div>
          </div>

          <form className="form-grid" onSubmit={handleContactSubmit}>
            <label htmlFor="name">
              Nome
              <input
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleContactField}
                placeholder="Seu nome"
              />
            </label>

            <label htmlFor="eventType">
              Tipo de solicitacao
              <select
                id="eventType"
                name="eventType"
                value={contactForm.eventType}
                onChange={handleContactField}
              >
                <option value="">Selecione</option>
                <option value="Cobertura de evento">Cobertura de evento</option>
                <option value="Anuncio no marketplace">Anuncio no marketplace</option>
                <option value="Duvida geral">Duvida geral</option>
              </select>
            </label>

            <label htmlFor="date">
              Data prevista
              <input
                id="date"
                name="date"
                type="date"
                value={contactForm.date}
                onChange={handleContactField}
              />
            </label>

            <label htmlFor="city">
              Cidade
              <input
                id="city"
                name="city"
                value={contactForm.city}
                onChange={handleContactField}
                placeholder="Cidade do evento ou retirada"
              />
            </label>

            <label htmlFor="details">
              Detalhes
              <textarea
                id="details"
                name="details"
                value={contactForm.details}
                onChange={handleContactField}
                placeholder="Conte o que voce precisa"
              />
            </label>

            <div className="button-row">
              <button type="submit" className="primary-button">
                Enviar no WhatsApp
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Depoimentos</h2>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.author} className="testimonial-card">
              <p>"{item.quote}"</p>
              <strong>{item.author}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="panel calendar-banner">
        <div>
          <h2 className="panel-title">Calendario de ensaios</h2>
          <p className="panel-subtitle">
            Um ponto fixo para o quadrilheiro saber onde e quando acontece o proximo encontro.
          </p>
        </div>
        <div className="calendar-list">
          {rehearsalCalendar.map((entry) => (
            <article key={`${entry.date}-${entry.place}`} className="calendar-item">
              <strong>{entry.date}</strong>
              <p>{entry.event}</p>
              <span>{entry.place}</span>
            </article>
          ))}
        </div>
        <div className="button-row">
          <Link to="/noticias">
            <button type="button" className="secondary-button">
              Ver agenda completa
            </button>
          </Link>
          <a
            href={makeWhatsAppLink('Quero receber o calendario junino semanal.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button" className="ghost-button">
              Receber no WhatsApp
            </button>
          </a>
        </div>
      </section>
    </>
  )
}
