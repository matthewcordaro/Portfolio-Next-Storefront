/**
 * Provides a singleton instance of the PrismaClient for database access.
 *
 * This utility ensures that only one instance of PrismaClient is created and reused
 * across the application, especially during development with hot-reloading.
 *
 * - In production, a new PrismaClient instance is created per invocation.
 * - In development, the instance is attached to the global object to prevent
 *   exhausting database connections due to repeated instantiation.
 *
 * @module utils/db
 * @see {@link https://www.prisma.io/docs/guides/performance-and-optimization/connection-management}
 */
import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => new PrismaClient()

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
