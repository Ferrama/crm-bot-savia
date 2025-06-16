import { PrismaClient } from "@prisma/client";

export class PrismaService {
  private prismaClient: PrismaClient;

  private notificationsService: any | null = null;

  private readonly logger = console; // Using console as logger for now

  constructor() {
    this.prismaClient = new PrismaClient({
      log: ["query", "info", "warn", "error"]
    });
    this.configureLogging(this.prismaClient);
  }

  /**
   * Configura dependencias externas después de la inicialización.
   */
  setDependencies(notificationsService: any) {
    this.notificationsService = notificationsService;
  }

  /**
   * Método para inicializar la conexión de Prisma.
   */
  async initialize(): Promise<void> {
    try {
      await this.prismaClient.$connect();
      this.logger.log("Prisma connected successfully");
    } catch (error) {
      this.logger.error(`Error connecting to Prisma: ${error.message}`);
      throw error;
    }
  }

  /**
   * Método para cerrar la conexión de Prisma.
   */
  async disconnect(): Promise<void> {
    try {
      await this.prismaClient.$disconnect();
      this.logger.log("Prisma disconnected successfully");
    } catch (error) {
      this.logger.error(`Error disconnecting Prisma: ${error.message}`);
    }
  }

  /**
   * Devuelve el cliente de Prisma.
   */
  getClient(): PrismaClient {
    return this.prismaClient;
  }

  /**
   * Ejecuta una tarea utilizando un PrismaClient conectado a una base de datos específica.
   */
  async executeTask(
    db: string,
    task: (prisma: PrismaClient) => Promise<any>
  ): Promise<any> {
    const prismaWithUrl = new PrismaClient({
      datasources: { db: { url: db } },
      log: ["error"]
    });

    try {
      return await task(prismaWithUrl);
    } catch (error) {
      const errorMessage = `Task failed for database: ${db} - Error: ${error.message}`;
      this.logger.error(errorMessage);

      if (this.notificationsService) {
        await this.notificationsService.sendSlackNotification(
          errorMessage,
          "error",
          "prisma-task"
        );
      }

      throw error;
    } finally {
      await prismaWithUrl.$disconnect();
    }
  }

  /**
   * Ejecuta una tarea con una conexión temporal a una base de datos específica
   */
  async executeTaskNew<T>(
    db: string,
    task: (prisma: PrismaClient) => Promise<T>,
    options: {
      retryAttempts?: number;
      retryDelay?: number;
      timeout?: number;
    } = {}
  ): Promise<T> {
    const { retryAttempts = 3, retryDelay = 1000 } = options;
    const clientId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const executeWithRetry = async (attempt: number): Promise<T> => {
      const tempClient = new PrismaClient({
        datasources: { db: { url: db } },
        log: ["info", "warn", "error"]
      });

      this.configureLogging(tempClient);

      try {
        this.logger.log(
          `[Client ${clientId}] Connecting to temporary database...`
        );
        await tempClient.$connect();

        const result = await task(tempClient);

        await tempClient.$disconnect();
        this.logger.log(
          `[Client ${clientId}] Disconnected from temporary database`
        );
        return result;
      } catch (error) {
        await tempClient.$disconnect();
        const errorMessage = `[Client ${clientId}] Task failed (attempt ${attempt}/${retryAttempts}): ${error.message}`;
        this.logger.error(errorMessage);

        if (this.notificationsService) {
          await this.notificationsService
            .sendSlackNotification(errorMessage, "error", "prisma-task")
            .catch(() => {
              // Ignore notification errors
            });
        }

        if (attempt === retryAttempts) {
          throw error;
        }

        await new Promise<void>(resolve => {
          setTimeout(resolve, retryDelay);
        });
        return executeWithRetry(attempt + 1);
      }
    };

    return executeWithRetry(1);
  }

  /**
   * Configura el registro de eventos de Prisma.
   */
  private configureLogging(prisma: PrismaClient) {
    // prisma.$on('query' as never, (event: Prisma.QueryEvent) => {
    //   this.logger.log(`Query: ${event.query}`);
    //   this.logger.log(`Duration: ${event.duration}ms`);
    // });

    // prisma.$on('info' as never, (event: Prisma.LogEvent) => {
    //   this.logger.debug(`Info: ${event.message}`);
    // });

    // prisma.$on('warn' as never, (event: Prisma.LogEvent) => {
    //   this.logger.warn(`Warning: ${event.message}`);
    // });

    prisma.$on("error" as never, async (event: any) => {
      const errorMessage = `Prisma Error: ${event.message}`;
      this.logger.error(errorMessage);

      if (this.notificationsService) {
        try {
          await this.notificationsService.sendSlackNotification(
            errorMessage,
            "error",
            "prisma-task"
          );
        } catch (err) {
          this.logger.error(
            `Error sending notification to Slack: ${err.message}`
          );
        }
      }
    });
  }
}
