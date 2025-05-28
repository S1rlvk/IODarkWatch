import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useLastUpdated() {
  const { data, error, isLoading } = useSWR('/api/summary', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  return {
    lastUpdated: data?.lastUpdated,
    isLoading,
    isError: error
  }
} 