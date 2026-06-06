import { prisma } from '../lib/prisma.js'

export async function getCurrentUser(userId) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  })
}

export async function updateProfile(userId, data) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      phone: true,
      role: true,
    },
  })
}
