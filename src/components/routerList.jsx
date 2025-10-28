export const RouterList = ({ headerList, list }) => {
  const sumUp = (str) => {
    let val = Array.from(str).reduce((a, b) => Number(a) + Number(b), 0);
    return val;
  };

  return (
    <div className="bg-card ml-20 py-8 px-4 md:px-8 mx-5 my-8 rounded-xl shadow-lg border border-border/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-muted/70 backdrop-blur-md border-b border-border/30 px-2 py-3 rounded-t-xl">
        <div className="grid grid-cols-5 text-center font-semibold text-foreground text-sm md:text-base uppercase tracking-wide">
          {headerList.map((heading, key) => (
            <span key={key}>{heading}</span>
          ))}
        </div>
      </div>

      {/* List items */}
      <div className="max-h-[60vh] overflow-y-auto overflow-x-auto mt-3 rounded-b-xl custom-scrollbar">
        {list.length > 0 ? (
          list.map((item, key) => (
            <div
              key={key}
              className="grid grid-cols-5 text-center text-sm md:text-base px-2 py-3 mb-2 bg-graph-area/40 rounded-lg hover:bg-graph-area/70 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 ease-in-out cursor-pointer"
            >
              <span className="font-medium">{item.name}</span>
              <span className="font-mono">{item.routerIP}</span>
              <span>{item.holderNumber || "—"}</span>
              <span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-red-500/20 text-red-400 border border-red-500/40"
                  }`}
                >
                  {item.status ? "Active" : "Off"}
                </span>
              </span>
              <span className="font-bold text-primary">{sumUp(item.connections)}</span>
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
