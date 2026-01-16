import { CarouselSlider } from '@/components/common/carousel-slider';
import React from 'react';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 24;
const BANNER_HEIGHT = 140;
const AUTO_SCROLL_INTERVAL = 3000;

interface BannerItem {
    id: string;
    image: string;
}

const BANNER_DATA: BannerItem[] = [
    {
        id: '1',
        image: 'https://down-vn.img.susercontent.com/file/sg-11134258-82260-mhlnp92ot8g396@resize_w1594_nl.webp',
    },
    {
        id: '2',
        image: 'https://down-vn.img.susercontent.com/file/sg-11134258-81zw4-miof1zb54qh3dd@resize_w1594_nl.webp',
    },
    { id: '3', image: 'https://i.imgur.com/7hKwN2P.png' },
    {
        id: '4',
        image: 'https://down-vn.img.susercontent.com/file/sg-11134258-81zwp-miof1xwgpgjrf3@resize_w1594_nl.webp',
    },
    {
        id: '5',
        image: 'https://down-vn.img.susercontent.com/file/sg-11134258-81zvv-miof8fl0aqdcee@resize_w1594_nl.webp',
    },
];

export const BannerSlider = () => {
    return (
        <CarouselSlider
            data={BANNER_DATA}
            width={BANNER_WIDTH}
            height={BANNER_HEIGHT}
            autoScrollInterval={AUTO_SCROLL_INTERVAL}
        />
    );
};
