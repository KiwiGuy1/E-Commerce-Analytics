declare module "pg" {
  export interface PoolConfig {
    connectionString?: string;
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
  }

  export interface PoolClient {}

  export class Pool {
    constructor(config?: PoolConfig);
    end(): Promise<void>;
  }
}
