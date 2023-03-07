const verifyApiKey = (
  apiKey: string
): {
  valid: boolean;
  error?: string;
  session?: { userId: string };
} => {
  return {
    valid: true,
    session: {
      userId: apiKey,
    },
  };
};

export { verifyApiKey };
