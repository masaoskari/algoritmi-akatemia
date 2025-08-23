"use client";
import { useState } from "react";
import GDPRCircle from "./GDPRCircle";

export default function PrivacyLink() {
  const [triggerGDPR, setTriggerGDPR] = useState(false);

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTriggerGDPR(true);
    // Reset trigger after expansion
    setTimeout(() => setTriggerGDPR(false), 100);
  };

  return (
    <>
      <p className="text-center text-sm text-gray-400">
        Rekisteröitymällä hyväksyt{" "}
        <button
          onClick={handlePrivacyClick}
          className="text-primary hover:underline font-medium"
        >
          tietosuojakäytännöt
        </button>
        .
      </p>

      <GDPRCircle onExpanded={triggerGDPR} />
    </>
  );
}
