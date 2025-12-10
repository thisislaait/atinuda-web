'use client';

import { useEffect } from "react";

/**
 * Injects the Flutterwave checkout script once on the client.
 */
export function FlutterwaveScript() {
  useEffect(() => {
    if (document.getElementById("flw-script")) return;
    const s = document.createElement("script");
    s.id = "flw-script";
    s.src = "https://checkout.flutterwave.com/v3.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return null;
}
