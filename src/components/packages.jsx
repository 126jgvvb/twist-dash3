import { Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { addPackage, deletePackage } from "../redux/defaultSlice";
import { networkObject } from "../pages/network";
import { useState } from "react";

export const PackagesList = ({ headerList, list, admin }) => {
  const dispatch = useDispatch();
  const [isAddingPackage, setAdding] = useState(false);

  const addNewPackage = async () => {
    const packName = document.getElementById("new-pack").value.trim();
    const packAmount = document.getElementById("new-amount").value.trim();

    if (
      !packName ||
      !packAmount ||
      /[+#$%@!*-]/.test(packName) ||
      /[+#$%@!*-]/.test(packAmount) ||
      /[a-zA-Z]/.test(packAmount)
    ) {
      alert("⚠️ Check your input — something seems wrong");
      return;
    }

    if (await networkObject.isNetworkError()) {
      alert("Network Error — try again later");
      return;
    }

    setAdding(true);
    const result = networkObject.sendPostRequest(
      { newPackage: packName, adminID: admin.uniqueID, price: packAmount },
      "/admin/set-package"
    );

    result.then((response) => {
      setAdding(false);
      if (response) {
        alert("✅ Package added successfully!");
        dispatch(addPackage({ payload: { duration: packName, price: packAmount } }));
      } else {
        console.error("Error adding package to server.");
      }
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border/20 py-10 px-6 md:px-10 mx-5 my-10">
      {/* Header */}
      <div className="grid grid-cols-3 md:grid-cols-5 text-center text-foreground font-semibold text-base md:text-lg border-b border-border/30 pb-3 mb-4">
        {headerList.map((heading, key) => (
          <span key={key}>{heading}</span>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:space-x-10 space-y-8 md:space-y-0">
        {/* List area */}
        <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
          {list.length > 0 ? (
            list.map((item, key) => (
              <div
                key={key}
                className="grid grid-cols-3 md:grid-cols-5 items-center text-center text-primary bg-graph-area/40 mb-3 rounded-lg py-3 hover:bg-graph-area/70 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
              >
                <span className="font-medium">{item.duration}</span>
                <span className="font-mono">ugx.{item.price}</span>
                <span className="text-foreground hover:text-red-400 cursor-pointer flex justify-center">
                  <Trash
                    size={18}
                    onClick={() => dispatch(deletePackage({ name: item.duration }))}
                    className="transition-transform hover:scale-110 active:scale-95"
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground italic">
              No packages added yet
            </div>
          )}
        </div>

        {/* Add new package */}
        <div className="md:w-1/3 bg-muted/10 p-5 rounded-xl border border-border/20 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Package Name</label>
            <input
              id="new-pack"
              type="text"
              placeholder="e.g., 1 week"
              className="w-full py-2 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Package Amount</label>
            <input
              id="new-amount"
              type="text"
              placeholder="e.g., 5000"
              className="w-full py-2 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-200"
            />
          </div>

          <button
            onClick={addNewPackage}
            disabled={isAddingPackage}
            className={`w-full py-2.5 rounded-lg font-medium text-primary-foreground bg-gradient-to-r from-indigo-500 to-green-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 ${
              isAddingPackage ? "opacity-70 cursor-not-allowed" : "hover:scale-105 active:scale-95"
            }`}
          >
            {isAddingPackage ? "Saving..." : "Save Package"}
          </button>
        </div>
      </div>
    </div>
  );
};
