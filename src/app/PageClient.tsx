"use client";

import { useEffect } from "react";
import { bodyHtml } from "./content";

export default function PageClient() {
  useEffect(() => {
    // Run the inline login-check script
    if (!localStorage.getItem("zpay_token")) {
      document.body.classList.add("login-visible");
    }

    // Load i18n.js then app.js in order
    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(s);
      });

    loadScript("/i18n.js")
      .then(() => loadScript("/app.js"))
      .catch((e) => console.error("Script load error:", e));
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
