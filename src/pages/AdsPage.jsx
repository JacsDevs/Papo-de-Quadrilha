import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  moderateAd,
  subscribeToApprovedAds,
  subscribeToPendingAds,
} from '../services/firestoreService'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function formatDate(value) {
  if (!value?.toDate) {
    return 'agora'
  }

  return value.toDate().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function AdsPage() {
  const { user, isAdmin } = useAuth()
  const [approvedAds, setApprovedAds] = useState([])
  const [pendingAds, setPendingAds] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [moderationMessage, setModerationMessage] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeToApprovedAds(
      (items) => {
        setApprovedAds(items)
        setErrorMessage('')
      },
      () => setErrorMessage('Falha ao carregar anúncios aprovados.'),
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!isAdmin) {
      return undefined
    }

    const unsubscribe = subscribeToPendingAds(
      (items) => {
        setPendingAds(items)
      },
      () => setErrorMessage('Falha ao carregar fila de moderação.'),
    )

    return unsubscribe
  }, [isAdmin])

  const handleModeration = async (adId, status) => {
    if (!user) {
      return
    }

    setModerationMessage('')
    try {
      await moderateAd(adId, status, user.uid)
      setModerationMessage(
        status === 'approved'
          ? 'Anúncio aprovado com sucesso.'
          : 'Anúncio rejeitado com sucesso.',
      )
    } catch (error) {
      console.error(error)
      setModerationMessage('Não foi possível moderar o anúncio.')
    }
  }

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="panel-title">Anúncios da comunidade</h2>
        <p className="panel-subtitle">
          Confira os itens disponíveis para compra e venda no Papo de Quadrilha.
        </p>
        <div className="button-row" style={{ marginTop: '1rem' }}>
          <Link to={user ? '/perfil' : '/login'}>
            <button type="button" className="primary-button">
              {user ? 'Publicar meu anúncio' : 'Entrar para publicar'}
            </button>
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Vitrine pública</h2>

        {errorMessage ? <p className="status-message error">{errorMessage}</p> : null}

        {!approvedAds.length && !errorMessage ? (
          <p className="empty-state">Ainda não há anúncios aprovados.</p>
        ) : (
          <div className="list-grid" style={{ marginTop: '0.8rem' }}>
            {approvedAds.map((ad) => (
              <article key={ad.id} className="card">
                <div className="card-top">
                  <div>
                    <h3 className="card-title">{ad.title}</h3>
                    <p className="card-meta">
                      {currencyFormatter.format(ad.price || 0)} - {ad.category || 'Sem categoria'}
                    </p>
                  </div>
                  <span className="badge approved">Aprovado</span>
                </div>
                <p className="card-text">{ad.description}</p>
                <p className="card-meta">
                  Contato: {ad.contact} - Publicado em {formatDate(ad.createdAt)}
                </p>
                <p className="card-meta">Anunciante: {ad.ownerName || 'Comunidade'}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {isAdmin ? (
        <section className="panel">
          <h2 className="panel-title">Moderação do admin</h2>
          <p className="panel-subtitle">Aprove ou rejeite os anúncios pendentes.</p>

          {moderationMessage ? (
            <p
              className={`status-message ${
                moderationMessage.includes('não') ? 'error' : 'success'
              }`}
              style={{ marginTop: '0.6rem' }}
            >
              {moderationMessage}
            </p>
          ) : null}

          {!pendingAds.length ? (
            <p className="empty-state" style={{ marginTop: '0.8rem' }}>
              Nenhum anúncio pendente no momento.
            </p>
          ) : (
            <div className="list-grid" style={{ marginTop: '0.8rem' }}>
              {pendingAds.map((ad) => (
                <article key={ad.id} className="card">
                  <div className="card-top">
                    <div>
                      <h3 className="card-title">{ad.title}</h3>
                      <p className="card-meta">
                        {currencyFormatter.format(ad.price || 0)} - {ad.category || 'Sem categoria'}
                      </p>
                    </div>
                    <span className="badge pending">Pendente</span>
                  </div>
                  <p className="card-text">{ad.description}</p>
                  <p className="card-meta">
                    Anunciante: {ad.ownerName || 'Usuário'} - Contato: {ad.contact}
                  </p>
                  <div className="button-row" style={{ marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleModeration(ad.id, 'approved')}
                    >
                      Aprovar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleModeration(ad.id, 'rejected')}
                    >
                      Rejeitar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
