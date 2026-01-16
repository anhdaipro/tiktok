import { useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API update - Thay thế bằng API thực tế của bạn
const updateProfileApi = async (data: any) => {
    console.log("Updating profile with data:", data);
    // Giả lập delay mạng
    return new Promise((resolve) => setTimeout(() => resolve(data), 500));
}

export const useMutationUpdateProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateProfileApi,
        onSuccess: (newData, variables: any) => {
            // Invalidate query để fetch lại dữ liệu mới
            // Giả sử queryKey của profile là ['profile', userId] hoặc ['user', userId]
            // Invalidate rộng để đảm bảo cập nhật
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            
            // Nếu bạn biết chính xác queryKey, hãy dùng setQueryData để cập nhật lạc quan (optimistic update)
        }
    });
}