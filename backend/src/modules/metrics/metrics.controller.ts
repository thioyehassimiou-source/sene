import { Controller, GET, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import * as client from 'prom-client';

@ApiTags('Health & Monitoring')
@Controller('metrics')
export class MetricsController {
  private readonly registry: client.Registry;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry, prefix: 'sene_' });
  }

  @GET()
  @ApiOperation({ summary: 'Prometheus metrics scrape endpoint' })
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', this.registry.contentType);
    const metrics = await this.registry.metrics();
    res.end(metrics);
  }
}

