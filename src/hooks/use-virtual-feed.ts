'use client';

import type { RefObject } from 'react';
import { useCallback, useEffect, useState, useRef } from 'react';

const DEFAULT_ESTIMATED_ITEM_HEIGHT = 520;
const DEFAULT_OVERSCAN_PX = 800;

export type VirtualRange = {
  start: number;
  end: number;
};

export type VirtualItem = {
  id: string;
};

export type UseVirtualFeedOptions<T extends VirtualItem> = {
  items: T[];
  scrollRef: RefObject<HTMLDivElement | null>;
  estimatedItemHeight?: number;
  overscan?: number;
  enabled?: boolean;
};

export type UseVirtualFeedResult = {
  range: VirtualRange;
  topSpacer: number;
  bottomSpacer: number;
  registerHeight: (id: string, height: number) => void;
};

function findOffsetIndex(offsets: number[], value: number): number {
  if (offsets.length <= 1) {
    return 0;
  }
  let low = 0;
  let high = offsets.length - 2;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const start = offsets[mid];
    const end = offsets[mid + 1];
    if (value < start) {
      high = mid - 1;
    } else if (value >= end) {
      low = mid + 1;
    } else {
      return mid;
    }
  }
  return Math.max(0, Math.min(low, offsets.length - 2));
}

export function useVirtualFeed<T extends VirtualItem>({
  items,
  scrollRef,
  estimatedItemHeight = DEFAULT_ESTIMATED_ITEM_HEIGHT,
  overscan = DEFAULT_OVERSCAN_PX,
  enabled = true,
}: UseVirtualFeedOptions<T>): UseVirtualFeedResult {
  const heightsRef = useRef<Map<string, number>>(new Map());
  const [offsets, setOffsets] = useState<number[]>([0]);
  const [totalHeight, setTotalHeight] = useState(0);
  const [range, setRange] = useState<VirtualRange>(() => ({
    start: 0,
    end: items.length ? items.length - 1 : -1,
  }));

  const recomputeOffsets = useCallback(() => {
    const nextOffsets: number[] = [0];
    let running = 0;
    items.forEach((item) => {
      const height = heightsRef.current.get(item.id) ?? estimatedItemHeight;
      running += height;
      nextOffsets.push(running);
    });
    setOffsets(nextOffsets);
    setTotalHeight(running);
    const lastIndex = items.length - 1;
    setRange((prev) => {
      if (lastIndex < 0) {
        return { start: 0, end: -1 };
      }
      const start = Math.max(0, Math.min(prev.start, lastIndex));
      const end = Math.max(start, Math.min(prev.end, lastIndex));
      return { start, end };
    });
    return nextOffsets;
  }, [estimatedItemHeight, items]);

  useEffect(() => {
    if (!enabled) {
      setOffsets([0]);
      setTotalHeight(0);
      setRange({ start: 0, end: items.length ? items.length - 1 : -1 });
      return;
    }
    recomputeOffsets();
  }, [items, enabled, recomputeOffsets]);

  const updateRange = useCallback(() => {
    if (!enabled) {
      return;
    }
    const container = scrollRef.current;
    if (!container || !offsets.length) {
      return;
    }
    const viewportHeight = container.clientHeight || 0;
    const scrollTop = container.scrollTop || 0;
    const lastIndex = items.length - 1;
    if (lastIndex < 0) {
      setRange({ start: 0, end: -1 });
      return;
    }
    const startIndex = findOffsetIndex(
      offsets,
      Math.max(0, scrollTop - overscan)
    );
    const endIndex = findOffsetIndex(
      offsets,
      scrollTop + viewportHeight + overscan
    );
    setRange({
      start: startIndex,
      end: Math.min(endIndex, lastIndex),
    });
  }, [enabled, items.length, offsets, overscan, scrollRef]);

  useEffect(() => {
    updateRange();
  }, [updateRange]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const container = scrollRef.current;
    if (!container) {
      return undefined;
    }
    const handler = () => {
      updateRange();
    };
    container.addEventListener('scroll', handler);
    return () => {
      container.removeEventListener('scroll', handler);
    };
  }, [enabled, scrollRef, updateRange]);

  const registerHeight = useCallback(
    (id: string, height: number) => {
      if (!enabled || !height) {
        return;
      }
      const prev = heightsRef.current.get(id);
      if (prev === height) {
        return;
      }
      heightsRef.current.set(id, height);
      recomputeOffsets();
    },
    [enabled, recomputeOffsets]
  );

  if (!enabled) {
    return {
      range: {
        start: 0,
        end: items.length ? items.length - 1 : -1,
      },
      topSpacer: 0,
      bottomSpacer: 0,
      registerHeight: () => undefined,
    };
  }

  const topSpacer = offsets[range.start] ?? 0;
  const bottomSpacer =
    totalHeight - (offsets[range.end + 1] ?? totalHeight ?? 0);

  return {
    range,
    topSpacer,
    bottomSpacer: Math.max(0, bottomSpacer),
    registerHeight,
  };
}
