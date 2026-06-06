import { getCurrentUser, updateProfile } from '../repositories/user.repository.js'

export async function register(req, res) {
  // Implementa el registro con validación, hash de contraseña y creación de usuario.
  res.status(501).json({ message: 'Registro no implementado todavía' })
}

export async function login(req, res) {
  // Implementa inicio de sesión, validación y emisión de JWT.
  res.status(501).json({ message: 'Login no implementado todavía' })
}

export async function me(req, res) {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const user = await getCurrentUser(userId)
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }

  return res.json(user)
}

export async function updateUserProfile(req, res) {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const { firstName, lastName, username, phone } = req.body
  const updatedUser = await updateProfile(userId, {
    firstName,
    lastName,
    username,
    phone,
  })

  return res.json(updatedUser)
}
