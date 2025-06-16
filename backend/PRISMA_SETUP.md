# Prisma Setup Guide

Este guide te ayudará a configurar Prisma en el backend de Ticketz con soporte para múltiples bases de datos.

## Prerequisites

1. Instalar dependencias de Prisma:

```bash
npm install prisma @prisma/client
```

2. Asegúrate de tener PostgreSQL y MySQL instalados y ejecutándose.

## Setup Steps

### 1. Configuración del Environment

Agrega lo siguiente a tu archivo `.env-backend-local`:

```env
# PostgreSQL (base de datos principal)
DATABASE_URL="postgresql://ticketz@postgres:5432/ticketz"

# MySQL (stellasdb)
MYSQL_DATABASE_URL="mysql://savia:inout@138.219.43.164:3306/correasdb"
```

### 2. Inicializar Prisma

Ejecuta los siguientes comandos para configurar Prisma:

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Aplicar el schema a la base de datos
npm run prisma:db:push

# O crear y aplicar migraciones
npm run prisma:migrate
```

### 3. Integración con Docker

El proyecto ya está configurado para inicializar Prisma automáticamente cuando se levanta con Docker:

```bash
# Levantar el proyecto completo
docker-compose -f docker-compose-devlocal.yaml up
```

El script `scripts/init-db.sh` se ejecutará automáticamente y:

- Instalará dependencias
- Generará el cliente de Prisma
- Aplicará el schema a la base de datos
- Ejecutará migraciones de Sequelize
- Ejecutará seeds de Sequelize
- Iniciará el servidor de desarrollo

### 4. Uso del PrismaService

El PrismaService proporciona:

- **Patrón Singleton**: Solo se crea una instancia de PrismaClient
- **Gestión de Conexiones**: Conexión y desconexión automática
- **Manejo de Errores**: Manejo completo de errores con logging
- **Soporte Multi-base de datos**: Capacidad de conectarse a diferentes bases de datos
- **Lógica de Reintento**: Mecanismos de reintento integrados para operaciones fallidas
- **Manejo de Timeouts**: Timeouts configurables para operaciones

### 5. Ejemplos de Uso

#### Uso Básico con PostgreSQL

```typescript
import { prisma } from "../database/prisma";

// Consulta simple
const users = await prisma.user.findMany();

// Crear un nuevo registro
const newUser = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com"
  }
});
```

#### Uso del PrismaService

```typescript
import { PrismaService } from "../services/PrismaService/PrismaService";

const prismaService = PrismaService.getInstance();
const client = prismaService.getClient();

// Usar el cliente
const users = await client.user.findMany();
```

#### Operaciones Multi-base de datos (MySQL)

```typescript
import { PrismaService } from "../services/PrismaService/PrismaService";

const prismaService = PrismaService.getInstance();

// Ejecutar tarea en base de datos MySQL específica
await prismaService.executeTaskNew(
  "mysql://savia:inout@138.219.43.164:3306/correasdb",
  async prisma => {
    // Aquí puedes ejecutar consultas específicas para stellasdb
    // const users = await prisma.user.findMany();
    return { message: "Conectado exitosamente a stellasdb" };
  },
  {
    retryAttempts: 3,
    retryDelay: 2000,
    timeout: 30000
  }
);
```

#### Servicio Específico para MySQL (StellasService)

```typescript
import { StellasService } from "../services/StellasService";

const stellasService = new StellasService();

// Obtener datos de stellasdb
const data = await stellasService.getStellasData();

// Crear registro en stellasdb
const newRecord = await stellasService.createStellasRecord({
  name: "Test User",
  email: "test@example.com"
});
```

### 6. Scripts Disponibles

- `npm run prisma:generate` - Generar cliente de Prisma
- `npm run prisma:migrate` - Crear y aplicar migraciones
- `npm run prisma:migrate:deploy` - Desplegar migraciones en producción
- `npm run prisma:studio` - Abrir Prisma Studio (GUI de base de datos)
- `npm run prisma:db:push` - Aplicar cambios del schema directamente a la base de datos
- `npm run prisma:db:seed` - Ejecutar seeds de la base de datos

### 7. Migración desde Sequelize

Si estás migrando de Sequelize a Prisma:

1. Define tus modelos en `prisma/schema.prisma`
2. Genera el cliente: `npm run prisma:generate`
3. Crea migraciones: `npm run prisma:migrate`
4. Actualiza tus servicios para usar Prisma en lugar de Sequelize

### 8. Troubleshooting

- **Problemas de Conexión**: Verifica tus URLs de base de datos en el archivo `.env-backend-local`
- **Generación del Cliente**: Ejecuta `npm run prisma:generate` después de cambios en el schema
- **Problemas de Migración**: Usa `npm run prisma:db:push` para desarrollo o `npm run prisma:migrate` para producción
- **Errores de MySQL**: Verifica que la base de datos MySQL esté accesible desde el contenedor Docker

## Características del Servicio

El PrismaService incluye:

- **Patrón Singleton**: Asegura solo una conexión de base de datos
- **Logging de Errores**: Logging completo de errores con notificaciones opcionales de Slack
- **Lógica de Reintento**: Reintento automático con intentos y delays configurables
- **Protección de Timeout**: Timeouts configurables para prevenir operaciones colgadas
- **Soporte Multi-base de datos**: Conectarse a diferentes bases de datos según sea necesario
- **Shutdown Graceful**: Limpieza adecuada al cerrar la aplicación

## Configuración de Docker

El proyecto está configurado para ejecutar automáticamente:

1. **Instalación de dependencias**
2. **Generación del cliente de Prisma**
3. **Aplicación del schema a la base de datos**
4. **Migraciones de Sequelize**
5. **Seeds de Sequelize**
6. **Inicio del servidor de desarrollo**

Todo esto se ejecuta automáticamente cuando levantas el proyecto con `docker-compose`.
