import { NavBar } from "../components/NavBar";
import { useState, useEffect } from "react";

export const TestPage = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar admin={{ username: "Test Admin" }} />
      <div className="p-4 pt-20 md:pt-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-4">Test Page</h1>
        <p className="mb-6">This is a test page to verify the navbar functionality.</p>
        
        <div className="bg-muted p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">Current Window Size:</h2>
          <p>Width: {windowSize.width}px</p>
          <p>Height: {windowSize.height}px</p>
          <p className="mt-2">
            {windowSize.width < 640 ? "Mobile view" : "Desktop view"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Navbar Features:</h3>
            <ul className="space-y-1">
              <li>• On desktop: Sidebar menu</li>
              <li>• On mobile: Top navigation bar</li>
              <li>• Hamburger menu for mobile</li>
              <li>• Smooth transitions</li>
            </ul>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How to Test:</h3>
            <ul className="space-y-1">
              <li>• Resize your browser window</li>
              <li>• Open Chrome DevTools</li>
              <li>• Click on Toggle Device Toolbar</li>
              <li>• Select a mobile device</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};