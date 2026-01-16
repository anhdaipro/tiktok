import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const useMutationUpload = () => {
    const mutation = useMutation({
      mutationFn: async (data: any) => {
        const res = await axiosClient.post('/api/upload', data, { });
        return res.data;
      },
    });
    return mutation
};
export default useMutationUpload;