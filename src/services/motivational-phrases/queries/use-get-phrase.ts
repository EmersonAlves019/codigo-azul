import { QUERY_KEYS } from "@/constants/query-keys"
import { getPhrase } from "../actions/get-phrase"
import { useQuery } from "@tanstack/react-query"

export const useGetPhrase = () => { 
    return useQuery<string>({
        queryKey: QUERY_KEYS.GET_PHRASE,
        queryFn: getPhrase,
    })
}