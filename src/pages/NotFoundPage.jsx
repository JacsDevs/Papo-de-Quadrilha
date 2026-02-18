import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="panel" style={{ textAlign: 'center' }}>
      <h2 className="panel-title">Página não encontrada</h2>
      <p className="panel-subtitle">O endereço informado não existe no Papo de Quadrilha.</p>
      <div className="button-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
        <Link to="/">
          <button type="button" className="primary-button">
            Voltar ao início
          </button>
        </Link>
      </div>
    </section>
  )
}
