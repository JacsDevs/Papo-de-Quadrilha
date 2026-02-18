import { useEffect, useMemo, useState } from 'react'
import {
  createAd,
  deleteOwnAd,
  subscribeToAdsByOwner,
} from '../services/firestoreService'
import { useAuth } from '../contexts/AuthContext'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function renderDate(value) {
  if (!value?.toDate) {
    return 'agora'
  }

  return value.toDate().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function ProfilePage() {
  const { user, profile, updateOwnProfile } = useAuth()
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    photoURL: '',
    bio: '',
  })
  const [ads, setAds] = useState([])
  const [adsError, setAdsError] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [adMessage, setAdMessage] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [creatingAd, setCreatingAd] = useState(false)
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    contact: '',
  })

  useEffect(() => {
    setProfileForm({
      displayName: profile?.displayName || user?.displayName || '',
      photoURL: profile?.photoURL || user?.photoURL || '',
      bio: profile?.bio || '',
    })
  }, [profile, user])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    const unsubscribe = subscribeToAdsByOwner(
      user.uid,
      (items) => {
        setAds(items)
        setAdsError('')
      },
      () => {
        setAdsError('Não foi possível carregar seus anúncios.')
      },
    )

    return unsubscribe
  }, [user])

  const totalAds = useMemo(() => ads.length, [ads])

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdChange = (event) => {
    const { name, value } = event.target
    setAdForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    setProfileMessage('')

    if (!profileForm.displayName.trim()) {
      setProfileMessage('Informe seu nome de exibição.')
      return
    }

    setSavingProfile(true)
    try {
      await updateOwnProfile(profileForm)
      setProfileMessage('Perfil atualizado com sucesso.')
    } catch (error) {
      console.error(error)
      setProfileMessage('Falha ao atualizar perfil.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleCreateAd = async (event) => {
    event.preventDefault()
    setAdMessage('')

    if (
      !adForm.title.trim() ||
      !adForm.description.trim() ||
      !adForm.price.trim() ||
      !adForm.contact.trim()
    ) {
      setAdMessage('Preencha título, descrição, preço e contato.')
      return
    }

    if (!user) {
      setAdMessage('Faça login para publicar anúncio.')
      return
    }

    setCreatingAd(true)
    try {
      await createAd(user.uid, {
        ...adForm,
        ownerName: profile?.displayName || user.displayName || user.email,
      })
      setAdForm({
        title: '',
        description: '',
        price: '',
        category: '',
        contact: '',
      })
      setAdMessage('Anúncio enviado para moderação do admin.')
    } catch (error) {
      console.error(error)
      setAdMessage('Falha ao publicar anúncio.')
    } finally {
      setCreatingAd(false)
    }
  }

  const handleDeleteAd = async (adId) => {
    if (!user) {
      return
    }

    const shouldDelete = window.confirm('Excluir este anúncio?')
    if (!shouldDelete) {
      return
    }

    setAdMessage('')
    try {
      await deleteOwnAd(adId, user.uid)
      setAdMessage('Anúncio removido.')
    } catch (error) {
      console.error(error)
      setAdMessage('Não foi possível remover o anúncio.')
    }
  }

  return (
    <div className="split-layout">
      <section className="panel stack">
        <div>
          <h2 className="panel-title">Meu perfil</h2>
          <p className="panel-subtitle">
            Você pode editar apenas as informações do seu perfil.
          </p>
        </div>

        <form className="form-grid" onSubmit={handleSaveProfile}>
          <label htmlFor="displayName">
            Nome de exibição
            <input
              id="displayName"
              name="displayName"
              value={profileForm.displayName}
              onChange={handleProfileChange}
            />
          </label>

          <label htmlFor="photoURL">
            URL da foto
            <input
              id="photoURL"
              name="photoURL"
              value={profileForm.photoURL}
              onChange={handleProfileChange}
              placeholder="https://..."
            />
          </label>

          <label htmlFor="bio">
            Mini bio
            <textarea
              id="bio"
              name="bio"
              value={profileForm.bio}
              onChange={handleProfileChange}
              placeholder="Conte um pouco sobre você"
            />
          </label>

          {profileMessage ? (
            <p
              className={`status-message ${
                profileMessage.includes('sucesso') ? 'success' : 'error'
              }`}
            >
              {profileMessage}
            </p>
          ) : null}

          <div className="button-row">
            <button type="submit" className="primary-button" disabled={savingProfile}>
              {savingProfile ? 'Salvando...' : 'Salvar perfil'}
            </button>
          </div>
        </form>
      </section>

      <section className="stack">
        <article className="panel">
          <h2 className="panel-title">Publicar anúncio</h2>
          <p className="panel-subtitle">
            Todos os anúncios passam por aprovação do administrador antes de aparecer para o
            público.
          </p>

          <form className="form-grid" style={{ marginTop: '1rem' }} onSubmit={handleCreateAd}>
            <label htmlFor="title">
              Título
              <input
                id="title"
                name="title"
                value={adForm.title}
                onChange={handleAdChange}
                placeholder="Ex: Traje junino completo"
              />
            </label>

            <label htmlFor="description">
              Descrição
              <textarea
                id="description"
                name="description"
                value={adForm.description}
                onChange={handleAdChange}
                placeholder="Detalhes do produto"
              />
            </label>

            <label htmlFor="price">
              Preço (R$)
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={adForm.price}
                onChange={handleAdChange}
              />
            </label>

            <label htmlFor="category">
              Categoria
              <input
                id="category"
                name="category"
                value={adForm.category}
                onChange={handleAdChange}
                placeholder="Vestuário, Acessórios, Instrumentos..."
              />
            </label>

            <label htmlFor="contact">
              Contato
              <input
                id="contact"
                name="contact"
                value={adForm.contact}
                onChange={handleAdChange}
                placeholder="WhatsApp, Instagram ou telefone"
              />
            </label>

            {adMessage ? (
              <p className={`status-message ${adMessage.includes('Falha') ? 'error' : 'success'}`}>
                {adMessage}
              </p>
            ) : null}

            <div className="button-row">
              <button type="submit" className="secondary-button" disabled={creatingAd}>
                {creatingAd ? 'Publicando...' : 'Publicar anúncio'}
              </button>
            </div>
          </form>
        </article>

        <article className="panel">
          <h2 className="panel-title">Meus anúncios ({totalAds})</h2>
          <p className="panel-subtitle">Acompanhe o status das suas publicações.</p>

          {adsError ? <p className="status-message error">{adsError}</p> : null}

          {!ads.length && !adsError ? (
            <p className="empty-state">Você ainda não publicou anúncios.</p>
          ) : (
            <div className="list-grid" style={{ marginTop: '0.8rem' }}>
              {ads.map((ad) => (
                <article key={ad.id} className="card">
                  <div className="card-top">
                    <div>
                      <h3 className="card-title">{ad.title}</h3>
                      <p className="card-meta">
                        {currencyFormatter.format(ad.price || 0)} -{' '}
                        {ad.category || 'Sem categoria'} - {renderDate(ad.createdAt)}
                      </p>
                    </div>
                    <span className={`badge ${ad.status || 'pending'}`}>{ad.status || 'pending'}</span>
                  </div>
                  <p className="card-text">{ad.description}</p>
                  <p className="card-meta">Contato: {ad.contact}</p>
                  <div className="button-row" style={{ marginTop: '0.45rem' }}>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeleteAd(ad.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}
