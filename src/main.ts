import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error: unknown) => {
  // Startup failure must be loud and fatal: anything less leaves a half-dead
  // process that an orchestrator would happily consider "running".
  // use console.error instead of logger because logger may not be initialized yet;
  // the entrypoint catch uses the most primitive channel that cannot itself fail
  console.error('Fatal error during bootstrap', error);
  process.exit(1);
});
