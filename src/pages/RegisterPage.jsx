import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { user, registerWithEmail } = useAuth()
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (user) {
    return <Navigate to="/perfil" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!form.displayName.trim() || !form.email.trim() || !form.password.trim()) {
      setErrorMessage('Preencha nome, email e senha.')
      return
    }

    if (form.password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('A confirmação de senha não confere.')
      return
    }

    setPending(true)
    try {
      await registerWithEmail({
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/perfil')
    } catch (error) {
      console.error(error)
      setErrorMessage('Não foi possível criar sua conta.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="panel" style={{ maxWidth: '560px', margin: '0 auto' }}>
      <h2 className="panel-title">Criar conta</h2>
      <p className="panel-subtitle">Cadastre-se para publicar anúncios no Papo de Quadrilha.</p>

      <form className="form-grid" style={{ marginTop: '1rem' }} onSubmit={handleSubmit}>
        <label htmlFor="displayName">
          Nome de exibição
          <input
            id="displayName"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            placeholder="Seu nome ou apelido"
          />
        </label>

        <label htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="voce@email.com"
          />
        </label>

        <label htmlFor="password">
          Senha
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
          />
        </label>

        <label htmlFor="confirmPassword">
          Confirmar senha
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repita sua senha"
          />
        </label>

        {errorMessage ? <p className="status-message error">{errorMessage}</p> : null}

        <div className="button-row">
          <button type="submit" className="primary-button" disabled={pending}>
            {pending ? 'Criando conta...' : 'Criar conta'}
          </button>
        </div>
      </form>

      <p className="panel-subtitle" style={{ marginTop: '1rem' }}>
        Já possui conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  )
}
