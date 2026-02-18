import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, loginWithEmail, loginWithGoogle } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (user) {
    return <Navigate to="/perfil" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailLogin = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!form.email.trim() || !form.password.trim()) {
      setErrorMessage('Informe email e senha para continuar.')
      return
    }

    setPending(true)
    try {
      await loginWithEmail({
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/perfil')
    } catch (error) {
      console.error(error)
      setErrorMessage('Não foi possível fazer login. Confira suas credenciais.')
    } finally {
      setPending(false)
    }
  }

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    setPending(true)
    try {
      await loginWithGoogle()
      navigate('/perfil')
    } catch (error) {
      console.error(error)
      setErrorMessage('Falha no login com Google.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="panel" style={{ maxWidth: '560px', margin: '0 auto' }}>
      <h2 className="panel-title">Entrar</h2>
      <p className="panel-subtitle">Acesse sua conta para publicar anúncios e editar seu perfil.</p>

      <form className="form-grid" style={{ marginTop: '1rem' }} onSubmit={handleEmailLogin}>
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
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Digite sua senha"
          />
        </label>

        {errorMessage ? <p className="status-message error">{errorMessage}</p> : null}

        <div className="button-row">
          <button type="submit" className="primary-button" disabled={pending}>
            {pending ? 'Entrando...' : 'Entrar com email'}
          </button>
          <button
            type="button"
            className="secondary-button"
            disabled={pending}
            onClick={handleGoogleLogin}
          >
            Entrar com Google
          </button>
        </div>
      </form>

      <p className="panel-subtitle" style={{ marginTop: '1rem' }}>
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </section>
  )
}
