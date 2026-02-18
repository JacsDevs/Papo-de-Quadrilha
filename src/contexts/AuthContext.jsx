/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateAuthProfile,
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/config'
import { ensureUserDocument, updateUserProfileData } from '../services/firestoreService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribeProfile = null

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile()
        unsubscribeProfile = null
      }

      if (!firebaseUser) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      setUser(firebaseUser)

      try {
        await ensureUserDocument(firebaseUser)
      } catch (error) {
        console.error('Erro ao sincronizar usuário:', error)
      }

      unsubscribeProfile = onSnapshot(
        doc(db, 'users', firebaseUser.uid),
        (snapshot) => {
          setProfile(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null)
          setLoading(false)
        },
        (error) => {
          console.error('Erro ao carregar perfil:', error)
          setLoading(false)
        },
      )
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeProfile) {
        unsubscribeProfile()
      }
    }
  }, [])

  const registerWithEmail = async ({ email, password, displayName }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)

    if (displayName?.trim()) {
      await updateAuthProfile(credential.user, { displayName: displayName.trim() })
    }

    await ensureUserDocument({
      ...credential.user,
      displayName: displayName?.trim() || credential.user.displayName,
    })
  }

  const loginWithEmail = ({ email, password }) =>
    signInWithEmailAndPassword(auth, email, password)

  const loginWithGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider)
    await ensureUserDocument(credential.user)
  }

  const logout = () => signOut(auth)

  const updateOwnProfile = async ({ displayName, bio, photoURL }) => {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado.')
    }

    const cleanData = {
      displayName: displayName.trim(),
      bio: bio.trim(),
      photoURL: photoURL.trim(),
    }

    await updateUserProfileData(auth.currentUser.uid, cleanData)
    await updateAuthProfile(auth.currentUser, {
      displayName: cleanData.displayName || auth.currentUser.displayName || null,
      photoURL: cleanData.photoURL || null,
    })
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      registerWithEmail,
      loginWithEmail,
      loginWithGoogle,
      logout,
      updateOwnProfile,
    }),
    [user, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }

  return context
}
