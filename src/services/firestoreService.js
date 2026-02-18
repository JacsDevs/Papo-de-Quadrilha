import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const usersCollection = collection(db, 'users')
const adsCollection = collection(db, 'ads')
const newsCollection = collection(db, 'news')

const fallbackErrorHandler = (error) => {
  console.error('Erro ao ler dados do Firestore:', error)
}

const mapSnapshotDocs = (snapshot) =>
  snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))

export async function ensureUserDocument(firebaseUser) {
  if (!firebaseUser) {
    return
  }

  const userRef = doc(usersCollection, firebaseUser.uid)
  const userSnapshot = await getDoc(userRef)

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? 'Novo usuário',
      photoURL: firebaseUser.photoURL ?? '',
      bio: '',
      role: 'user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return
  }

  const currentData = userSnapshot.data()
  const updates = {
    updatedAt: serverTimestamp(),
  }

  if (!currentData.displayName && firebaseUser.displayName) {
    updates.displayName = firebaseUser.displayName
  }

  if (!currentData.photoURL && firebaseUser.photoURL) {
    updates.photoURL = firebaseUser.photoURL
  }

  await updateDoc(userRef, updates)
}

export async function updateUserProfileData(userId, data) {
  const userRef = doc(usersCollection, userId)

  await updateDoc(userRef, {
    displayName: data.displayName ?? '',
    bio: data.bio ?? '',
    photoURL: data.photoURL ?? '',
    updatedAt: serverTimestamp(),
  })
}

export function subscribeToAdsByOwner(ownerId, onData, onError = fallbackErrorHandler) {
  if (!ownerId) {
    return () => {}
  }

  const ownerAdsQuery = query(
    adsCollection,
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(
    ownerAdsQuery,
    (snapshot) => {
      onData(mapSnapshotDocs(snapshot))
    },
    (error) => onError(error),
  )
}

export function subscribeToApprovedAds(onData, onError = fallbackErrorHandler) {
  const approvedAdsQuery = query(
    adsCollection,
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(
    approvedAdsQuery,
    (snapshot) => {
      onData(mapSnapshotDocs(snapshot))
    },
    (error) => onError(error),
  )
}

export function subscribeToPendingAds(onData, onError = fallbackErrorHandler) {
  const pendingAdsQuery = query(
    adsCollection,
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(
    pendingAdsQuery,
    (snapshot) => {
      onData(mapSnapshotDocs(snapshot))
    },
    (error) => onError(error),
  )
}

export async function createAd(ownerId, data) {
  await addDoc(adsCollection, {
    ownerId,
    ownerName: data.ownerName ?? 'Usuário',
    title: data.title.trim(),
    description: data.description.trim(),
    price: Number(data.price) || 0,
    category: data.category.trim() || 'Outros',
    contact: data.contact.trim(),
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteOwnAd(adId, ownerId) {
  const adRef = doc(adsCollection, adId)
  const adSnapshot = await getDoc(adRef)

  if (!adSnapshot.exists()) {
    throw new Error('Anúncio não encontrado.')
  }

  if (adSnapshot.data().ownerId !== ownerId) {
    throw new Error('Você só pode excluir os seus próprios anúncios.')
  }

  await deleteDoc(adRef)
}

export async function moderateAd(adId, status, adminId) {
  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Status de moderação inválido.')
  }

  await updateDoc(doc(adsCollection, adId), {
    status,
    reviewedBy: adminId,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function subscribeToPublishedNews(onData, onError = fallbackErrorHandler) {
  const newsQuery = query(newsCollection, orderBy('createdAt', 'desc'))

  return onSnapshot(
    newsQuery,
    (snapshot) => {
      onData(mapSnapshotDocs(snapshot))
    },
    (error) => onError(error),
  )
}

export async function createNews(adminId, data) {
  await addDoc(newsCollection, {
    authorId: adminId,
    title: data.title.trim(),
    summary: data.summary.trim(),
    content: data.content.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteNews(newsId) {
  await deleteDoc(doc(newsCollection, newsId))
}
