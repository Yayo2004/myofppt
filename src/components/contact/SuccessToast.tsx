"use client";

import { useEffect, useState } from "react";

export default function SuccessToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 animate-fade-in rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-center shadow-lg">
      <p className="text-xs font-medium text-emerald-700">Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</p>
    </div>
  );
}
