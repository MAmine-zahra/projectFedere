import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { nom, mot_de_passe } = await request.json()

  try {
    const user = await prisma.user.findUnique({
      where: { nom },
    })

    if (user && user.mot_de_passe === mot_de_passe) {
      return NextResponse.json({ valid: true })
    } else {
      return NextResponse.json({ valid: false, message: 'Identifiant ou mot de passe incorrect.' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ valid: false, message: 'Erreur serveur.' }, { status: 500 })
  }
}
