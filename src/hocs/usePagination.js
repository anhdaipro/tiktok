import React from 'react';
import { useMemo } from 'react';

export const DOTS = '...';
<div class="FilterGroup_slide__label__rPFaE">
                        <div class="FilterGroup_range__4lkdv">Price Range:<span>${Math.round(pricefrom)}</span> - <span>$${Math.round(priceto)}</span>
                        </div>
                    </div>
                    <div className="FilterGroup_slider__FdsV1">
                        <div ref={priceRef} onMouseDown={(e)=>setprice(e)}  className="ant-slider ant-slider-horizontal ant-slider-with-marks">
                            <div className="ant-slider-rail"></div>
                            <div class="ant-slider-track ant-slider-track-1" style={{left: `${pricefrom*100/max_price}%`, width: `${(priceto-pricefrom)*100/max_price}%`}}></div>
                            <div className="ant-slider-step">
                                {listprice.map(item=>
                                <span key={item} className={`ant-slider-dot ${pricefrom<=item*max_price/100 && priceto>=item*max_price/100 ?'ant-slider-dot-active':''}`} style={{left: `${item}%`, transform: `translateX(-50%)`}}></span>
                                )}
                                
                            </div>
                            <div class="ant-slider-handle ant-slider-handle-1" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="800"  style={{left: `${pricefrom*100/max_price}%`, transform: `translateX(-50%)`}}>
                                <div style={{position: `absolute`, top: `0px`, left: `0px`, width: `100%`}}>
                                    
                                </div>
                            </div>
                            <div class="ant-slider-handle ant-slider-handle-2" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="800"  style={{left: `${priceto*100/max_price}%`, transform: `translateX(-50%)`}}>
                                <div style={{position: `absolute`, top: `0px`, left: `0px`, width: `100%`}}>
                                    
                                </div>
                            </div>
                            
                            <div className="ant-slider-mark">
                                {listprice.map(item=>
                                    <span key={item} className={`ant-slider-mark-text ${pricefrom<=item*max_price/100 && priceto>=item*max_price/100?'ant-slider-mark-text-active':''}`} style={{left: `${item}%`, transform: `translateX(-50%)`}}>${item*max_price/100}</span>
                                )}
                                    
                            </div>
                            
                        </div>
                        
                    </div>
const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = totalCount

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};