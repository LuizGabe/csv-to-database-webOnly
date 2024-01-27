'use server'

import { Client, QueryResult } from 'pg';

const ConnectionData = {
  host: 'viaduct.proxy.rlwy.net',
  user: 'postgres',
  password: '1B3gbbfC3Bd2ag4f5bFBCaDdDf5G5C2D',
  database: 'railway',
  port: 17387,
};

const client = new Client(ConnectionData);

interface DatabaseInfo {
  currentTime: string;
  teste: string
}

export async function connectToPostgres(): Promise<DatabaseInfo | null> {
  try {
    await client.connect();

    const result: QueryResult = await client.query('SELECT NOW()');

    const databaseInfo: DatabaseInfo = {
      currentTime: result.rows[0].now.toString(),
      teste: "teste"
    };

    console.log('Conectado ao PostgreSQL!');
    console.log(databaseInfo);

    return databaseInfo;
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error);
    return null;
  } finally {
    // Certifique-se de fechar a conexão quando não precisar mais
    await client.end();
  }
}
