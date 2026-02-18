import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  createNews,
  deleteNews,
  subscribeToPublishedNews,
} from '../services/firestoreService'

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

export default function NewsPage() {
  const { user, isAdmin } = useAuth()
  const [newsItems, setNewsItems] = useState([])
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [pending, setPending] = useState(false)
  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    content: '',
  })

  useEffect(() => {
    const unsubscribe = subscribeToPublishedNews(
      (items) => {
        setNewsItems(items)
        setErrorMessage('')
      },
      () => setErrorMessage('Não foi possível carregar as notícias.'),
    )

    return unsubscribe
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewsForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateNews = async (event) => {
    event.preventDefault()
    setMessage('')
    setErrorMessage('')

    if (!user || !isAdmin) {
      setErrorMessage('Somente administradores podem criar notícias.')
      return
    }

    if (!newsForm.title.trim() || !newsForm.summary.trim() || !newsForm.content.trim()) {
      setErrorMessage('Preencha título, resumo e conteúdo.')
      return
    }

    setPending(true)
    try {
      await createNews(user.uid, newsForm)
      setNewsForm({ title: '', summary: '', content: '' })
      setMessage('Notícia publicada com sucesso.')
    } catch (error) {
      console.error(error)
      setErrorMessage('Falha ao publicar notícia.')
    } finally {
      setPending(false)
    }
  }

  const handleDeleteNews = async (newsId) => {
    if (!isAdmin) {
      return
    }

    const shouldDelete = window.confirm('Excluir esta notícia?')
    if (!shouldDelete) {
      return
    }

    setMessage('')
    setErrorMessage('')
    try {
      await deleteNews(newsId)
      setMessage('Notícia removida.')
    } catch (error) {
      console.error(error)
      setErrorMessage('Não foi possível remover notícia.')
    }
  }

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="panel-title">Notícias</h2>
        <p className="panel-subtitle">
          Atualizações oficiais, eventos, ensaios e avisos da comunidade.
        </p>
      </section>

      {isAdmin ? (
        <section className="panel">
          <h2 className="panel-title">Publicar notícia (admin)</h2>
          <form className="form-grid" style={{ marginTop: '1rem' }} onSubmit={handleCreateNews}>
            <label htmlFor="title">
              Título
              <input
                id="title"
                name="title"
                value={newsForm.title}
                onChange={handleChange}
                placeholder="Título da notícia"
              />
            </label>

            <label htmlFor="summary">
              Resumo
              <textarea
                id="summary"
                name="summary"
                value={newsForm.summary}
                onChange={handleChange}
                placeholder="Resumo curto para destaque"
              />
            </label>

            <label htmlFor="content">
              Conteúdo
              <textarea
                id="content"
                name="content"
                value={newsForm.content}
                onChange={handleChange}
                placeholder="Conteúdo completo da notícia"
              />
            </label>

            {message ? <p className="status-message success">{message}</p> : null}
            {errorMessage ? <p className="status-message error">{errorMessage}</p> : null}

            <div className="button-row">
              <button type="submit" className="primary-button" disabled={pending}>
                {pending ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="panel">
        <h2 className="panel-title">Últimas publicações</h2>
        {errorMessage && !isAdmin ? <p className="status-message error">{errorMessage}</p> : null}

        {!newsItems.length && !errorMessage ? (
          <p className="empty-state">Ainda não há notícias publicadas.</p>
        ) : (
          <div className="list-grid" style={{ marginTop: '0.8rem' }}>
            {newsItems.map((item) => (
              <article key={item.id} className="card">
                <div className="card-top">
                  <div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-meta">Publicado em {formatDate(item.createdAt)}</p>
                  </div>
                  {isAdmin ? <span className="badge approved">Admin</span> : null}
                </div>
                <p className="card-text">
                  <b>Resumo:</b> {item.summary}
                </p>
                <p className="card-text">{item.content}</p>
                {isAdmin ? (
                  <div className="button-row" style={{ marginTop: '0.45rem' }}>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeleteNews(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
