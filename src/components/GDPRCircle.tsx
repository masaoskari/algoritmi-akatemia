"use client";
import { useState, useEffect } from "react";

export default function GDPRCircle({ onExpanded }: { onExpanded?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (onExpanded) {
      setIsExpanded(true);
    }
  }, [onExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6">
        {isExpanded && (
          <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-6 max-w-md w-80 mb-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-3">
              🛡️ Tietosuoja ja evästeet
            </h3>

            <div className="text-sm text-gray-700 space-y-3">
              <p>
                <strong>Miksi tarvitsemme tietojasi?</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Tallentaa edistymisesi tehtävissä</li>
                <li>Näyttää henkilökohtaisia tilastoja</li>
                <li>Parantaa oppimiskokemusta</li>
              </ul>

              <p>
                <strong>Mitä tietoja keräämme?</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Sähköpostiosoite (kirjautumista varten)</li>
                <li>Suoritetut tehtävät ja pisteet</li>
                <li>Käyttötilastot (anonyymisti)</li>
                <li>Evästeet toiminnallisuuden varmistamiseksi</li>
              </ul>

              <p className="text-xs text-gray-600">
                Tietojasi ei jaeta kolmansille osapuolille. Voit pyytää tilisi
                poistamista milloin tahansa.
              </p>
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                onClick={toggleExpanded}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-900 transition-colors flex-1"
              >
                Selvä
              </button>
            </div>
          </div>
        )}
        <button
          onClick={toggleExpanded}
          className="bg-blue-600 hover:bg-blue-900 text-white text-xl w-14 h-14 rounded-full transition-all duration-300 hover:scale-110"
        >
          🛡️
        </button>
      </div>
    </>
  );
}
