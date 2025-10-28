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
    <div className="bg-card rounded-xl shadow-md border border-border/20 py-10 px-6 md:px-12 mx-5 my-10 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
        Add New Router
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Router Name */}
        <div className="flex flex-col space-y-3">
          <label htmlFor="router-name" className="text-sm font-semibold">
            Router Name
          </label>
          <input
            id="router-name"
            type="text"
            placeholder="e.g., EAP110-Lobby"
            className="w-full py-2 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-200"
          />
        </div>

        {/* Holder Number */}
        <div className="flex flex-col space-y-3">
          <label htmlFor="router-digits" className="text-sm font-semibold">
            Holder Number
          </label>
          <input
            id="router-digits"
            type="text"
            placeholder="+256*********"
            className="w-full py-2 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-200"
          />
        </div>

        {/* Router MAC / IP */}
        <div className="flex flex-col space-y-3">
          <label htmlFor="router-ip" className="text-sm font-semibold">
            Router MAC / IP
          </label>
          <input
            id="router-ip"
            type="text"
            placeholder="e.g., 192.168.0.1 or A4:B2:C3:D4:E5:F6"
            className="w-full py-2 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-200"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-end md:col-span-3 justify-center">
          <button
            onClick={addRouter}
            disabled={isAddingRouter}
            className={`w-full md:w-1/3 py-2.5 rounded-lg font-medium text-primary-foreground bg-gradient-to-r from-indigo-500 to-green-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 ${
              isAddingRouter ? "opacity-70 cursor-not-allowed" : "hover:scale-105 active:scale-95"
            }`}
          >
            {isAddingRouter ? "Saving..." : "Save Router"}
          </button>
        </div>
      </div>
    </div>
  );
};
