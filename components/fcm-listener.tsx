"use client";

import { useEffect } from "react";
import { onForegroundMessage } from "@/app/_config/firebase";

export function FCMListener() {
  useEffect(() => {
    onForegroundMessage();
  }, []);

  return null;
}
