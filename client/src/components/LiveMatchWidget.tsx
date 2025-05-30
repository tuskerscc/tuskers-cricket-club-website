import { useEffect } from 'react';

export default function LiveMatchWidget() {
  useEffect(() => {
    // Load the cricket widget script
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.innerHTML = `
      app="www.cricwaves.com"; 
      mo="f1_zd"; 
      nt="ban"; 
      mats=""; 
      tor=""; 
      Width='302px'; 
      Height='252px'; 
      wi="w"; 
      co="ban"; 
      ad="1";
    `;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = '//www.cricwaves.com/cricket/widgets/script/scoreWidgets.js?v=0.111';
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts on component unmount
      try {
        if (document.head.contains(script1)) document.head.removeChild(script1);
        if (document.head.contains(script2)) document.head.removeChild(script2);
      } catch (e) {
        // Ignore cleanup errors
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
        <div id="cricwaves-widget" className="w-full max-w-sm">
          {/* The widget will be loaded here by the external script */}
        </div>
      </div>
    </div>
  );
}