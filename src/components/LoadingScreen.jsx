export default function LoadingScreen({ message = 'Carregando dados...' }) {
  return (
    <div className="loading-screen">
      <span className="loader" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}
