import { Colors } from '@/constants/theme';
import BottomSheet, {
  BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './theme-context';

// === Định nghĩa Type và Context ===
type BottomSheetContextType = {
  showBottomSheet: (content: ReactNode, snapPoints?: string[]) => void;
  hideBottomSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

// === Hook để sử dụng ===
export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheet phải được dùng bên trong BottomSheetProvider');
  }
  return context;
};

// === Component Provider ===
export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // State để lưu trữ nội dung và snap points
  const [bottomSheetConfig, setBottomSheetConfig] = useState<{
    content: ReactNode;
    snapPoints: string[];
  } | null>(null);

  // Dùng useMemo để tính toán snapPoints chỉ khi config thay đổi
  const snapPoints = useMemo(
    () => bottomSheetConfig?.snapPoints || ['50%'],
    [bottomSheetConfig]
  );

  // Hàm hiển thị BottomSheet (chỉ set state)
  const showBottomSheet = useCallback(
    (newContent: ReactNode, points: string[] = ['50%']) => {
      setBottomSheetConfig({
        content: newContent,
        snapPoints: points,
      });
    },
    []
  );

  // Hàm ẩn BottomSheet (gọi `close()`)
  const hideBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // Lắng nghe sự thay đổi vị trí của sheet (ví dụ: khi vuốt đóng)
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      // Khi sheet đã đóng hoàn toàn, dọn dẹp state
      setBottomSheetConfig(null);
    }
  }, []);

  // Giá trị context
  const contextValue = useMemo(
    () => ({ showBottomSheet, hideBottomSheet }),
    [showBottomSheet, hideBottomSheet]
  );

  // <-- 2. Định nghĩa hàm render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1} // Ẩn khi sheet đóng
        appearsOnIndex={0}    // Hiện khi sheet mở
        pressBehavior="close" // Bấm vào backdrop để đóng
      />
    ),
    []
  );
  const {colors} = useTheme();
  const styles = useMemo(() => themeStlye(colors), []);

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}

      {/* 
        Chỉ render BottomSheet khi có config (nội dung).
        Điều này đảm bảo BottomSheet được khởi tạo với đúng snap points và content ngay từ đầu,
        tránh tình trạng sheet trượt lên mà không có nội dung ở lần mở đầu tiên.
      */}
      {bottomSheetConfig && (
        <BottomSheet
          ref={bottomSheetRef}
          // Thay vì dùng useEffect, chúng ta truyền trực tiếp index={0} để
          // BottomSheet tự động mở ra điểm neo đầu tiên ngay khi được render.
          // Điều này đảm bảo sheet mở ngay trong lần nhấn đầu tiên.
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          onChange={handleSheetChanges}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          handleComponent={null} // Thêm dòng này để ẩn hoàn toàn gạch ngang
          enableOverDrag={false}
          enableDynamicSizing={false} // tuân thủ sử dụng tham số snapPoints 
          // --- PHẦN THÊM VÀO ---
          backdropComponent={renderBackdrop} // <-- 3. Sử dụng backdropComponent
          // ---------------------

          // Styles
          backgroundStyle={styles.backgroundStyle}
          handleIndicatorStyle={styles.handleIndicator}
        >
          
            {bottomSheetConfig.content}
          
        </BottomSheet>
      )}
    </BottomSheetContext.Provider>
  );
};

// === Styles ===
const themeStlye = (colors: any) => StyleSheet.create({
  contentContainer: {
    flex: 1, // Đảm bảo contentContainer chiếm toàn bộ không gian
  },
  backgroundStyle: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    backgroundColor:Colors.gray300,
    width: 40,
  },
});