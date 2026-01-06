// app/api/debug-db/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  
  // Extraer información de la URL
  let dbInfo = {};
  if (dbUrl) {
    try {
      const url = new URL(dbUrl);
      dbInfo = {
        host: url.hostname,
        port: url.port,
        database: url.pathname.replace('/', ''),
        user: url.username,
        password: url.password ? '***' : 'none',
        fullUrl: dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
      };
    } catch (e) {
      dbInfo = { error: 'Invalid DATABASE_URL format' };
    }
  }
  
  // Verificar variables de Railway
  const railwayInfo = {
    projectId: process.env.RAILWAY_PROJECT_ID,
    serviceId: process.env.RAILWAY_SERVICE_ID,
    environment: process.env.RAILWAY_ENVIRONMENT,
    railwayGitBranch: process.env.RAILWAY_GIT_BRANCH,
    railwayGitRepo: process.env.RAILWAY_GIT_REPO,
  };
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbInfo,
    railway: railwayInfo,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    allEnvVars: Object.keys(process.env).filter(key => 
      key.includes('RAILWAY') || 
      key.includes('DATABASE') || 
      key.includes('POSTGRES')
    ),
  });
}