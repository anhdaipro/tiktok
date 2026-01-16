/**
 * Advanced Examples for CarouselSlider Component
 * 
 * This file contains advanced usage examples demonstrating
 * the full capabilities of the CarouselSlider component.
 */

import { CarouselItem, CarouselSlider } from '@/components/common/carousel-slider';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// Example 1: Product Carousel with Custom Render
// ============================================

interface ProductItem extends CarouselItem {
    title: string;
    price: number;
    discount?: string;
    rating: number;
}

const PRODUCTS: ProductItem[] = [
    {
        id: '1',
        image: 'https://example.com/product1.jpg',
        title: 'Wireless Headphones',
        price: 99.99,
        discount: '-20%',
        rating: 4.5,
    },
    {
        id: '2',
        image: 'https://example.com/product2.jpg',
        title: 'Smart Watch',
        price: 199.99,
        rating: 4.8,
    },
];

export const ProductCarousel = () => (
    <CarouselSlider
        data={PRODUCTS}
        width={SCREEN_WIDTH - 48}
        height={300}
        autoScrollInterval={5000}
        renderItem={(item: ProductItem) => (
            <View style={styles.productCard}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{item.title}</Text>
                    <Text style={styles.productPrice}>${item.price}</Text>
                    {item.discount && (
                        <Text style={styles.productDiscount}>{item.discount}</Text>
                    )}
                    <Text style={styles.productRating}>⭐ {item.rating}</Text>
                </View>
            </View>
        )}
    />
);

// ============================================
// Example 2: Testimonial Carousel
// ============================================

interface TestimonialItem extends CarouselItem {
    name: string;
    role: string;
    avatar: string;
    quote: string;
}

const TESTIMONIALS: TestimonialItem[] = [
    {
        id: '1',
        name: 'John Doe',
        role: 'CEO, TechCorp',
        avatar: 'https://example.com/avatar1.jpg',
        quote: 'This product changed our business completely!',
        image: '',
    },
];

export const TestimonialCarousel = () => (
    <CarouselSlider
        data={TESTIMONIALS}
        width={SCREEN_WIDTH - 32}
        height={200}
        autoScrollInterval={6000}
        borderRadius={16}
        showDots={true}
        renderItem={(item: TestimonialItem) => (
            <View style={styles.testimonialCard}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.quote}>"{item.quote}"</Text>
                <Text style={styles.author}>{item.name}</Text>
                <Text style={styles.role}>{item.role}</Text>
            </View>
        )}
    />
);

// ============================================
// Example 3: Full-Width Hero Carousel
// ============================================

const HERO_BANNERS: CarouselItem[] = [
    { id: '1', image: 'https://example.com/hero1.jpg' },
    { id: '2', image: 'https://example.com/hero2.jpg' },
    { id: '3', image: 'https://example.com/hero3.jpg' },
];

export const HeroCarousel = () => (
    <CarouselSlider
        data={HERO_BANNERS}
        width={SCREEN_WIDTH}
        height={250}
        autoScrollInterval={4000}
        borderRadius={0}
        paddingVertical={0}
        containerStyle={styles.heroContainer}
        dotColor="#FFFFFF"
    />
);

// ============================================
// Example 4: Manual Control (No Auto-scroll)
// ============================================

export const ManualCarousel = () => (
    <CarouselSlider
        data={HERO_BANNERS}
        width={SCREEN_WIDTH - 24}
        height={180}
        autoScrollInterval={0} // Disable auto-scroll
        borderRadius={12}
    />
);

// ============================================
// Example 5: Small Thumbnail Carousel
// ============================================

export const ThumbnailCarousel = () => (
    <CarouselSlider
        data={HERO_BANNERS}
        width={120}
        height={120}
        autoScrollInterval={2000}
        borderRadius={8}
        paddingVertical={8}
        showDots={false}
        imageStyle={{ resizeMode: 'cover' }}
    />
);

// ============================================
// Example 6: Video Carousel with Custom Render
// ============================================

interface VideoItem extends CarouselItem {
    thumbnail: string;
    duration: string;
    views: number;
}

const VIDEOS: VideoItem[] = [
    {
        id: '1',
        thumbnail: 'https://example.com/video1.jpg',
        duration: '5:30',
        views: 1200,
        image: 'https://example.com/video1.jpg',
    },
];

export const VideoCarousel = () => (
    <CarouselSlider
        data={VIDEOS}
        width={SCREEN_WIDTH - 24}
        height={200}
        autoScrollInterval={0}
        renderItem={(item: VideoItem) => (
            <View style={styles.videoCard}>
                <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
                <View style={styles.videoDuration}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                <View style={styles.videoInfo}>
                    <Text style={styles.videoViews}>{item.views} views</Text>
                </View>
            </View>
        )}
    />
);

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
    // Product Card
    productCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 200,
    },
    productInfo: {
        padding: 12,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    productDiscount: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 4,
    },
    productRating: {
        fontSize: 14,
        marginTop: 4,
    },

    // Testimonial Card
    testimonialCard: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 12,
    },
    quote: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 12,
    },
    author: {
        fontSize: 14,
        fontWeight: '600',
    },
    role: {
        fontSize: 12,
        color: '#666',
    },

    // Hero Container
    heroContainer: {
        paddingVertical: 0,
    },

    // Video Card
    videoCard: {
        flex: 1,
        position: 'relative',
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
    },
    videoDuration: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    videoInfo: {
        position: 'absolute',
        bottom: 8,
        left: 8,
    },
    videoViews: {
        color: '#fff',
        fontSize: 12,
        textShadowColor: 'rgba(0,0,0,0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
});
