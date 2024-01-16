import { Express } from 'express';

export interface ServerConfig {
  port: number;
}

export interface Server extends Express {}
