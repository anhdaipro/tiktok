/**
 * CarouselSlider Component - Reusable Infinite Carousel
 * 
 * A highly customizable carousel slider with infinite scroll, auto-play,
 * and gesture handling optimized for use within scrollable containers.
 * 
 * @example Basic Usage
 * ```tsx
 * import { CarouselSlider } from '@/components/common/carousel-slider';
 * 
 * const data = [
 *   { id: '1', image: 'https://example.com/image1.jpg' },
 *   { id: '2', image: 'https://example.com/image2.jpg' },
 * ];
 * 
 * <CarouselSlider
 *   data={data}
 *   width={350}
 *   height={200}
 *   autoScrollInterval={3000}
 * />
 * ```
 * 
 * @example Custom Render
 * ```tsx
 * <CarouselSlider
 *   data={products}
 *   width={300}
 *   height={400}
 *   renderItem={(item) => (
 *     <ProductCard product={item} />
 *   )}
 *   showDots={false}
 * />
 * ```
 * 
 * @example Disable Auto-scroll
 * ```tsx
 * <CarouselSlider
 *   data={data}
 *   width={350}
 *   height={200}
 *   autoScrollInterval={0} // Disable auto-scroll
 * />
 * ```
 */

export { CarouselSlider } from './carousel-slider';
export type { CarouselItem } from './carousel-slider';

