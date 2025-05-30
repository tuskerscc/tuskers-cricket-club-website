import { useEffect, useRef } from 'react';

export default function LiveMatchWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear any existing content
    if (widgetRef.current) {
      widgetRef.current.innerHTML = '';
    }

    // Set global variables for cricket widget
    (window as any).app = "www.cricwaves.com";
    (window as any).mo = "f1_zd";
    (window as any).nt = "ban";
    (window as any).mats = "";
    (window as any).tor = "";
    (window as any).Width = '302px';
    (window as any).Height = '252px';
    (window as any).wi = "w";
    (window as any).co = "ban";
    (window as any).ad = "1";

    // Load the cricket widget script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.cricwaves.com/cricket/widgets/script/scoreWidgets.js?v=0.111';
    script.async = true;
    
    // Add the script to the widget container
    if (widgetRef.current) {
      widgetRef.current.appendChild(script);
    }

    return () => {
      // Cleanup
      if (widgetRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-[#1e3a8a]">Live Cricket Scores</h3>
        <p className="text-gray-600 text-sm">Stay updated with latest cricket matches</p>
      </div>
      
      {/* Cricket Widget Container */}
      <div className="flex justify-center">
        <div 
          ref={widgetRef}
          className="w-full max-w-sm min-h-[252px] flex items-center justify-center"
          style={{ width: '302px', height: '252px' }}
        >
          <div className="text-gray-500 text-sm">Loading cricket scores...</div>
        </div>
      </div>
    </div>
  );
}