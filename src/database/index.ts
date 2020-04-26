import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  const testEnvironment = process.env.NODE_ENV === 'test';

  const testConfig = {
    name,
    database: 'gostack_desafio06_tests',
    port: 6666,
    password: 'test',
  };

  const devConfig = {
    name,
    database: 'go_finances',
    port: 5433,
    password: 'gofinances',
  };

  return createConnection(
    Object.assign(defaultOptions, testEnvironment ? testConfig : devConfig),
  );
};
