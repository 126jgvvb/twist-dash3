import { networkObject } from "../pages/network";
import { useDispatch } from "react-redux";
import { addRouter as addNewRouter } from "../redux/defaultSlice";
import { useState } from "react";

export const AddRouter = () => {
  const dispatch = useDispatch();
  const [isAddingRouter, setIsAdding] = useState(false);

  const addRouter = async () => {
    const routerName = document.getElementById("router-name").value.trim();
    const routerIP = document.getElementById("router-ip").value.trim();
    const holder = document.getElementById("router-digits").value.trim() || "+256*********";

    if (!routerName || !routerIP) {
      alert("⚠️ Check your input — router name or address missing");
      return;
    }

    if (await networkObject.isNetworkError()) {
      alert("Network Error — please check your connection");
      return;
    }

    setIsAdding(true);

    const payload = {
      name: routerName,
      routerIP,
      holderNumber: holder,
      connections: 0,
      lastChecked: new Date().toISOString(),
    };

    try {
      const result = await networkObject.sendPostRequest(payload, "/admin/add-router");
      if (result) {
        alert(" Router added successfully!");
        dispatch(addNewRouter({ name: routerName, routerIP, holderContact: holder }));
      } else {
        console.error("Server returned an unexpected response.");
      }
    } catch (err) {
      console.error("Error adding router:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Router Name */}
      <div className="space-y-2">
        <label htmlFor="router-name" className="text-sm font-medium text-foreground">
          Router Name
        </label>
        <input
          id="router-name"
          type="text"
          placeholder="e.g., Main Lobby"
          className="w-full px-4 py-3 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
        />
      </div>

      {/* Holder Number */}
      <div className="space-y-2">
        <label htmlFor="router-digits" className="text-sm font-medium text-foreground">
          Holder Number
        </label>
        <input
          id="router-digits"
          type="text"
          placeholder="+256 700 000000"
          className="w-full px-4 py-3 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
        />
      </div>

      {/* Router MAC / IP */}
      <div className="space-y-2">
        <label htmlFor="router-ip" className="text-sm font-medium text-foreground">
          Router MAC / IP
        </label>
        <input
          id="router-ip"
          type="text"
          placeholder="e.g., 192.168.1.1"
          className="w-full px-4 py-3 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={addRouter}
        disabled={isAddingRouter}
        className={`w-full py-3 rounded-lg font-medium text-primary-foreground gradient-button transition-all duration-300 ${
          isAddingRouter ? "opacity-70 cursor-not-allowed" : "hover:scale-105 active:scale-95"
        }`}
      >
        {isAddingRouter ? "Saving..." : "Save Router"}
      </button>
    </div>
  );
};
