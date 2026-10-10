
"use client";

import { useEffect } from "react";
import { recordRecentlyViewed } from "@/components/RecentlyViewed";

interface RecordProductViewProps {
  productId: number;
}

export default function RecordProductView({
  productId,
}: RecordProductViewProps) {
  useEffect(() => {
    recordRecentlyViewed(productId);
  }, [productId]);

  return null;
}
