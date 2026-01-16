import { create } from 'zustand';

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    name: 'Phạm Đại',
    phone: '(+84)03******10',
    address: 'Công Ty Cổ Phần Dầu Khí Miền Nam, 86 Đường Nguyễn Cửu Vân, Phường 17, Bình Thạnh, Hồ Chí Minh, Việt Nam',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Jiro',
    phone: '(+84)34*****10',
    address: 'số nhà 18, tổ 24a xã tân lập, Tân Lập, Bình Phước, Việt Nam',
    isDefault: false,
  },
  {
    id: '3',
    name: 'Phạm Đại',
    phone: '(+84)03******10',
    address: '9/13 Đường số 4, khu phố 6, Hiệp Bình Phước, Hiệp Bình Phước, Hồ Chí Minh, Việt Nam',
    isDefault: false,
  },
];

interface AddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  setAddresses: (addresses: Address[]) => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  addresses: MOCK_ADDRESSES,
  selectedAddress: null,
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  setAddresses: (addresses) => set({ addresses }),
}));