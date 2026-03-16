import 'server-only'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({ log: ['error'] })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Delay instantiation to bypass Turbopack's static AST proxy evaluation crash
const prisma = new Proxy({} as ReturnType<typeof prismaClientSingleton>, {
  get(target, prop, receiver) {
    if (!globalThis.prismaGlobal) {
      globalThis.prismaGlobal = prismaClientSingleton()
    }
    const client = globalThis.prismaGlobal
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  }
})

export default prisma
