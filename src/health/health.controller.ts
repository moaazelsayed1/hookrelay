import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';

@Controller('healthz')
export class HealthController {

    // This endpoint is used by the orchestrator to check if the service is alive and healthy.
    // it does not check anything but the liveness of the service itself, and should not be used to check DB, cache, or other dependencies.
    @Get()
    healthCheck(): object {
        return {
            status: 'ok',
            uptime: process.uptime(),
        }
    }
}
