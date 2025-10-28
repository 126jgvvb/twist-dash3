export const RouterList = ({ headerList, list }) => {
  const sumUp = (str) => {
    let val = Array.from(str).reduce((a, b) => Number(a) + Number(b), 0);
    return val;
  };

  return (
    <div className="bg-card w-[95%] md:w-[90%] lg:w-[80%] mx-auto py-8 px-4 md:px-8 my-8 rounded-xl shadow-lg border border-border/20 transition-all duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-md border-b border-border/30 px-2 py-3 rounded-t-xl">
        <div
          className="
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5
            text-center font-semibold text-foreground
            text-xs sm:text-sm md:text-base uppercase tracking-wide
          "
        >
          {headerList.map((heading, key) => (
            <span key={key} className="truncate">
              {heading}
            </span>
          ))}
        </div>
      </div>

      {/* List items */}
      <div className="max-h-[65vh] overflow-y-auto overflow-x-auto mt-3 rounded-b-xl custom-scrollbar">
        {list.length > 0 ? (
          list.map((item, key) => (
            <div
              key={key}
              className="
                grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5
                text-center text-xs sm:text-sm md:text-base
                px-2 py-3 mb-2 rounded-lg
                bg-graph-area/40 hover:bg-graph-area/70
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

