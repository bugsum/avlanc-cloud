// Public configuration (accessible on client-side)
const publicConfig = {
  app: {
    name: 'Avlanc Cloud',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

// Server-side configuration (not accessible on client-side)
const serverConfig = {
  app: {
    // Add any server-side specific configuration here
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_APP_URL',
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

export { publicConfig, serverConfig }; 