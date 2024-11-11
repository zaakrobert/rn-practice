import { Alert } from 'react-native'
import { useState } from 'react'

const useAppwrite = (fn) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fn();

      setData(response);
    } catch (error) {
      Alert.alert('Error(fetchData): ', error.message)
    } finally {
      setIsLoading(false);
    }
  }

  const refetch = () => fetchData();

  return { data, isLoading, refetch }
}

export default useAppwrite;