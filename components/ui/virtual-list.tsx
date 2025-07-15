import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscanCount?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  loading?: boolean;
  LoadingComponent?: React.ComponentType;
  EmptyComponent?: React.ComponentType;
}

function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className,
  overscanCount = 5,
  onEndReached,
  onEndReachedThreshold = 0.8,
  loading = false,
  LoadingComponent,
  EmptyComponent
}: VirtualListProps<T>) {
  const listRef = useRef<List>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Memoize the item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    items,
    renderItem
  }), [items, renderItem]);

  // Row renderer function
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    if (!item) return null;

    return (
      <div style={style} className="px-4">
        {renderItem(item, index)}
      </div>
    );
  }, [items, renderItem]);

  // Handle scroll events for infinite loading
  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: any) => {
    if (scrollUpdateWasRequested) return;

    const maxScrollTop = items.length * itemHeight - height;
    const scrollPercentage = scrollOffset / maxScrollTop;

    if (scrollPercentage >= onEndReachedThreshold && !isAtBottom && onEndReached) {
      setIsAtBottom(true);
      onEndReached();
    } else if (scrollPercentage < onEndReachedThreshold) {
      setIsAtBottom(false);
    }
  }, [items.length, itemHeight, height, onEndReachedThreshold, isAtBottom, onEndReached]);

  // Scroll to top when items change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0);
    }
  }, [items.length]);

  // Show loading component if loading and no items
  if (loading && items.length === 0) {
    return LoadingComponent ? <LoadingComponent /> : (
      <div className={cn("flex items-center justify-center", className)} style={{ height }}>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show empty component if no items
  if (items.length === 0) {
    return EmptyComponent ? <EmptyComponent /> : (
      <div className={cn("flex items-center justify-center", className)} style={{ height }}>
        <div className="text-muted-foreground">No items found</div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <List
        ref={listRef}
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        overscanCount={overscanCount}
        onScroll={handleScroll}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {Row}
      </List>
      
      {/* Loading indicator at bottom */}
      {loading && items.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="text-sm text-muted-foreground">Loading more...</div>
        </div>
      )}
    </div>
  );
}

// Hook for managing virtual list state
export function useVirtualList<T>(
  items: T[],
  options: {
    pageSize?: number;
    initialPage?: number;
  } = {}
) {
  const { pageSize = 20, initialPage = 1 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const paginatedItems = useMemo(() => {
    return items.slice(0, currentPage * pageSize);
  }, [items, currentPage, pageSize]);

  const loadMore = useCallback(() => {
    if (paginatedItems.length < items.length) {
      setCurrentPage(prev => prev + 1);
    } else {
      setHasMore(false);
    }
  }, [paginatedItems.length, items.length]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setHasMore(true);
  }, [initialPage]);

  return {
    items: paginatedItems,
    hasMore,
    loadMore,
    reset,
    currentPage,
    totalItems: items.length,
    loadedItems: paginatedItems.length
  };
}

export { VirtualList };
export type { VirtualListProps }; 