const appwriteEndpoint =
  process.env.NEXT_PUBLIC_APPWRITE_HOST_URL ||
  process.env.APPWRITE_HOST_URL ||
  "https://fra.cloud.appwrite.io/v1";

const appwriteProjectId =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
  process.env.APPWRITE_PROJECT_ID ||
  "";

const appwriteApiKey =
  process.env.APPWRITE_API_KEY ||
  process.env.APPWRITE_KEY ||
  "";

const env = {
  appwrite: {
    endpoint: appwriteEndpoint,
    projectId: appwriteProjectId,
    apikey: appwriteApiKey,
  },
};

export default env;