export const handleAsyncError = async (
  operation: () => Promise<any>,
  errorMessage: string
) => {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw error;
  }
};