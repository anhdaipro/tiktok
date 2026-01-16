// d:\app\tiktok\stores\use-cart-store.ts
import { zustandStorage } from '@/lib/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Types
export interface CartItemType {
  id: string;
  name: string;
  image: string;
  variant?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  isSelected: boolean;
  isOutStock?: boolean;
  tags?: string[];
}

export interface ShopGroupType {
  id: string;
  name: string;
  isMall?: boolean;
  items: CartItemType[];
}

interface CartState {
  // State
  shops: ShopGroupType[];
  isChange: boolean;

  // Actions
  initializeCart: (data: ShopGroupType[]) => void;
  addToCart: (shopId: string, item: CartItemType) => void;
  removeItem: (itemId: string) => void;
  toggleItem: (itemId: string) => void;
  toggleShop: (shopId: string) => void;
  toggleAll: () => void;
  updateQuantity: (itemId: string, type: 'inc' | 'dec') => void;
  setQuantity: (itemId: string, quantity: number) => void; // Set trực tiếp
  setIsChange: (isChange: boolean) => void;

  // Selectors
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getSelectedShops: () => ShopGroupType[];
  isAllSelected: () => boolean;
}

// Mock data
const MOCK_DATA: ShopGroupType[] = [
  {
    id: 'shop1',
    name: 'Star Shop Nhà phân phối See Food',
    isMall: false,
    items: [
      {
        id: 'p1',
        name: '1KG Lương khô 15 vị dinh dưỡng T...',
        image: 'https://i.imgur.com/dHy2fWw.png',
        variant: 'Không có lựa chọn này',
        price: 150000,
        quantity: 1,
        isSelected: false,
        isOutStock: true,
      },
    ],
  },
  {
    id: 'shop2',
    name: 'JYoohome Store',
    isMall: true,
    items: [
      {
        id: 'p2',
        name: '7in1 - Bộ Dụng Cụ Vệ Sinh L...',
        image: 'https://i.imgur.com/3Y2mYnm.png',
        variant: 'Bộ 7in1 Xanh',
        price: 42000,
        originalPrice: 64000,
        quantity: 1,
        isSelected: true,
        tags: ['12.12'],
      },
      {
        id: 'p3',
        name: '7in1 - Bộ Dụng Cụ Vệ Sinh L...',
        image: 'https://i.imgur.com/3Y2mYnm.png',
        variant: 'Bộ 7in1 Xanh',
        price: 42000,
        originalPrice: 64000,
        quantity: 1,
        isSelected: true,
        tags: ['12.12'],
      },
      {
        id: 'p4',
        name: '7in1 - Bộ Dụng Cụ Vệ Sinh L...',
        image: 'https://i.imgur.com/3Y2mYnm.png',
        variant: 'Bộ 7in1 Xanh',
        price: 42000,
        originalPrice: 64000,
        quantity: 1,
        isSelected: true,
        tags: ['12.12'],
      }
    ],
  },
  {
    id: 'shop3',
    name: 'Star Shop Nhà Phân Phối Harico',
    isMall: false,
    items: [
      {
        id: 'p5',
        name: '1Kg Lương khô mini mix 18 vị Hạt d...',
        image: 'https://i.imgur.com/gB44t2D.png',
        variant: 'Không có lựa chọn này',
        price: 120000,
        quantity: 1,
        isSelected: false,
        isOutStock: true,
      },
    ],
  },
  {
    id: 'shop4',
    name: 'Enchen.vn',
    isMall: true,
    items: [
      {
        id: 'p6',
        name: 'Máy cạo râu Enchen Mini 6, I...',
        image: 'https://i.imgur.com/dHy2fWw.png',
        variant: 'Mini 6',
        price: 189000,
        originalPrice: 250000,
        quantity: 1,
        isSelected: false,
        tags: ['12.12'],
      },
    ],
  },
];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      shops: MOCK_DATA,
      isChange: false,

      // Initialize cart with data
      initializeCart: (data) => set({ shops: data }),

      // Set change flag for animations
      setIsChange: (isChange) => set({ isChange }),

      // Add item to cart
      addToCart: (shopId, item) =>
        set((state) => {
          const shopExists = state.shops.find((s) => s.id === shopId);
          if (shopExists) {
            return {
              shops: state.shops.map((shop) =>
                shop.id === shopId
                  ? { ...shop, items: [...shop.items, item] }
                  : shop

              ),
              isChange: true,
            };
          }
          // Create new shop if doesn't exist
          return {
            shops: [...state.shops, { id: shopId, name: '', items: [item] }],
            isChange: true,
          };
        }),

      // Remove item from cart
      removeItem: (itemId) =>
        set((state) => {
          // Tìm shop chứa item cần xóa
          const updatedShops = state.shops
            .map((shop) => {
              // Kiểm tra nếu shop có item cần xóa
              const hasItem = shop.items.some((item) => item.id === itemId);
              if (!hasItem) return shop; // ✅ Giữ nguyên reference

              // Chỉ tạo mới nếu có item bị xóa
              const newItems = shop.items.filter((item) => item.id !== itemId);

              // Nếu shop còn items, return shop mới
              if (newItems.length > 0) {
                return { ...shop, items: newItems };
              }

              // Nếu shop hết items, return null để filter sau
              return null;
            })
            .filter((shop): shop is ShopGroupType => shop !== null); // Filter out empty shops

          return {
            shops: updatedShops,
            isChange: true,
          };
        }),

      // Toggle item selection
      toggleItem: (itemId) =>
        set((state) => {
          const newShops = state.shops.map((shop) => {
            const hasItem = shop.items.some((item) => item.id === itemId);
            if (!hasItem) return shop; // ✅ Giữ nguyên reference

            const newItems = shop.items.map((item) =>
              item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
            );

            return { ...shop, items: newItems };
          });

          return { shops: newShops };
        }),

      // Toggle all items in a shop
      toggleShop: (shopId) =>
        set((state) => ({
          shops: state.shops.map((shop) => {
            if (shop.id !== shopId) return shop;

            const availableItems = shop.items.filter((i) => !i.isOutStock);
            const isAllSelected = availableItems.every((i) => i.isSelected);

            return {
              ...shop,
              items: shop.items.map((item) =>
                !item.isOutStock ? { ...item, isSelected: !isAllSelected } : item
              ),
            };
          }),
        })),

      // Toggle all items in cart
      toggleAll: () =>
        set((state) => {
          const allAvailableItems = state.shops
            .flatMap((s) => s.items)
            .filter((i) => !i.isOutStock);
          const isAllSelected = allAvailableItems.every((i) => i.isSelected);

          return {
            shops: state.shops.map((shop) => ({
              ...shop,
              items: shop.items.map((item) =>
                !item.isOutStock ? { ...item, isSelected: !isAllSelected } : item
              ),
            })),
          };
        }),

      // Update item quantity
      updateQuantity: (itemId, type) =>
        set((state) => {
          const newShops = state.shops.map((shop) => {
            // Kiểm tra nếu shop này có item cần update
            const hasItem = shop.items.some((item) => item.id === itemId);
            if (!hasItem) return shop; // ✅ Giữ nguyên reference

            const newItems = shop.items.map((item) => {
              if (item.id !== itemId) return item;

              const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
              return { ...item, quantity: Math.max(1, newQty) };
            });

            return { ...shop, items: newItems };
          });

          return { shops: newShops };
        }),

      // Set item quantity directly (for keyboard input)
      setQuantity: (itemId, quantity) =>
        set((state) => {
          const newShops = state.shops.map((shop) => {
            // Kiểm tra nếu shop này có item cần update
            const hasItem = shop.items.some((item) => item.id === itemId);
            if (!hasItem) return shop; // ✅ Giữ nguyên reference nếu không thay đổi

            // Chỉ tạo mới nếu có thay đổi
            const newItems = shop.items.map((item) =>
              item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
            );

            return { ...shop, items: newItems };
          });

          return { shops: newShops };
        }),

      // Get total price of selected items
      getTotalPrice: () => {
        const state = get();
        return state.shops.reduce((total, shop) => {
          return (
            total +
            shop.items.reduce((shopTotal, item) => {
              return item.isSelected
                ? shopTotal + item.price * item.quantity
                : shopTotal;
            }, 0)
          );
        }, 0);
      },

      // Get total number of items
      getTotalItems: () => {
        const state = get();
        return state.shops.reduce((acc, shop) => acc + shop.items.length, 0);
      },

      // Get shops with selected items
      getSelectedShops: () => {
        const state = get();
        return state.shops
          .map((shop) => ({
            ...shop,
            items: shop.items.filter((i) => i.isSelected && !i.isOutStock),
          }))
          .filter((shop) => shop.items.length > 0);
      },

      // Check if all available items are selected
      isAllSelected: () => {
        const state = get();
        const allAvailableItems = state.shops
          .flatMap((s) => s.items)
          .filter((i) => !i.isOutStock);
        return allAvailableItems.length > 0 && allAvailableItems.every((i) => i.isSelected);
      },
    }),
    {
      name: 'cart-storage', // Tên key trong MMKV
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        shops: state.shops,
      }),
      // ⚙️ Callback khi persist load xong
      onRehydrateStorage: () => (state, error) => {

      },
    }
  ));
