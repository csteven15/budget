import useLocalStorage from './useLocalStorage'

function useAggregatedLocalStorage<T>(
  key: string,
  getAggregateId: (data: T) => unknown
) {
  const [aggregatedData, setAggregateData] = useLocalStorage<T[]>(key, [])

  const setAggregatedElement = (e: T) => {
    const elementToAggregate = e instanceof Function ? e(e) : e
    const newStorage = [
      ...aggregatedData.filter(
        (data) => getAggregateId(data) !== getAggregateId(e)
      ),
      { ...elementToAggregate },
    ]
    setAggregateData(newStorage)
  }

  return [aggregatedData, setAggregateData, setAggregatedElement] as const
}

export default useAggregatedLocalStorage
