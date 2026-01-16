import UserApi from "@/services/api/user";
import { useQuery } from "@tanstack/react-query";

export const useQueryProfile = (id:string) => {
    return useQuery({
        queryKey: ['profile', id],
        queryFn: () => UserApi.fetchProfile(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        retry:1,
    });
};