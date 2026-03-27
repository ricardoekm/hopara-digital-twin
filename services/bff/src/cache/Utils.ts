import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

interface RetryOptions {
  retries: number; // Number of retries
  delay: number; // Delay between retries in milliseconds
}

const axiosRetry = async <T>(
  requestConfig: AxiosRequestConfig,
  retryOptions: RetryOptions
): Promise<AxiosResponse<T> | undefined> => {
  const { retries, delay } = retryOptions
  
  let attempt = 0
  
  while (attempt <= retries) {
    try {
      const response = await axios(requestConfig)
      return response // Return response on success
    } catch (error) {
      attempt++

      if (attempt > retries) {
        throw error // Reached max retries, throw the error
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  return undefined // Return undefined if the function exhausts all retries
}

export default axiosRetry
