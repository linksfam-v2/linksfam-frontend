export interface Config {
  clientDisplayName: string | undefined; // The app name for creators to see
  environment: 'sandbox' | 'staging' | 'production'; // Specifies the environment
  userId: string | undefined; // Unique user ID returned by the API
  token: string | undefined; // SDK token for authentication
}
