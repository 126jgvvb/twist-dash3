import { Trash2 } from "lucide-react";
import { networkObject } from "../pages/network";
import { useDispatch } from "react-redux";
import { removeRouter } from "../redux/defaultSlice";

export const RouterList = ({ headerList, list }) => {
  const sumUp = (str) => {
    let val = Array.from(str).reduce((a, b) => Number(a) + Number(b), 0);
    return val;
  };

  const dispatch = useDispatch();

  const handleDeleteRouter = async (routerName, routerIP) => {
    if (confirm(`Are you sure you want to delete ${routerName}?`)) {
      try {
        const result = await networkObject.sendPostRequest(
          { routerIP: routerIP },
          '/admin/delete-router'
        );
        
        if (result) {
          dispatch(removeRouter({ routerIP }));
          alert('Router deleted successfully');
        } else {
          alert('Failed to delete router');
        }
      } catch (error) {
        console.error('Error deleting router:', error);
        alert('Error deleting router');
      }
    }
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Routers</h2>
        <p className="text-sm text-muted-foreground">{list.length} routers</p>
      </div>

      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border/30 px-2 py-3 rounded-t-xl">
        <div
          className="
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6
            text-center font-semibold text-foreground
            text-xs sm:text-sm md:text-base uppercase tracking-wide
          "
        >
          {headerList.map((heading, key) => (
            <span key={key} className="truncate">
              {heading}
            </span>
          ))}
          <span className="truncate">Actions</span>
        </div>
      </div>

      {/* List items */}
      <div className="max-h-[65vh] overflow-y-auto overflow-x-auto mt-3 rounded-b-xl custom-scrollbar">
        {list.length > 0 ? (
          list.map((item, key) => (
            <div
              key={key}
              className="
                grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6
                text-center text-xs sm:text-sm md:text-base
                px-2 py-3 mb-2 rounded-lg
                bg-muted/30 hover:bg-muted/50
                hover:shadow-lg hover:shadow-primary/10
                transition-all duration-200 ease-in-out
                cursor-pointer
              "
            >
              {/* Column 1: Router Name */}
              <span className="font-medium truncate">{item.name}</span>

              {/* Column 2: IP */}
              <span className="font-mono text-xs sm:text-sm truncate">
                {item.routerIP}
              </span>

              {/* Column 3: Holder Number (or hidden on very small screens) */}
              <span className="hidden sm:inline">
                {item.holderNumber || "—"}
              </span>

              {/* Column 4: Status */}
              <span className="hidden md:inline">
                <span
                  className={`px-2 py-1 rounded-full text-[0.65rem] sm:text-xs font-semibold whitespace-nowrap ${
                    item.status
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-red-500/20 text-red-400 border border-red-500/40"
                  }`}
                >
                  {item.status ? "Active" : "Off"}
                </span>
              </span>

              {/* Column 5: Connections */}
              <span className="font-bold text-primary">
                {sumUp(item.connections)}
              </span>

              {/* Column 6: Actions */}
              <span className="flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRouter(item.name, item.routerIP);
                  }}
                  className="p-1 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete Router"
                >
                  <Trash2 size={16} />
                </button>
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground italic">
            No routers found
          </div>
        )}
      </div>
    </div>
  );
};
