export const ListHeader = ({ listOfHeadings, listOfItems }) => {
  return (
    <div className="bg-card py-8 px-4 md:px-8 mx-5 my-8 rounded-xl shadow-lg border border-border/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-muted/70 backdrop-blur-md border-b border-border/30 px-2 py-3 rounded-t-xl">
        <div className="grid grid-cols-5 text-center font-semibold text-foreground text-sm md:text-base uppercase tracking-wide">
          {listOfHeadings.map((heading, key) => (
            <span key={key}>{heading}</span>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="max-h-[60vh] overflow-y-auto overflow-x-auto mt-3 rounded-b-xl custom-scrollbar">
        {listOfItems.length > 0 ? (
          listOfItems.map((item, key) => (
            <div
              key={key}
              className="grid grid-cols-5 text-center text-sm md:text-base px-2 py-3 mb-2 bg-graph-area/40 rounded-lg hover:bg-graph-area/70 transition-colors duration-200 ease-in-out cursor-pointer"
            >
              <span className="font-mono">{item.code}</span>
              <span>{item.phoneNumber}</span>
              <span
                className={`font-medium ${
                  item.isBound === "true"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {item.isBound === "true" ? "Active" : "Off"}
              </span>
              <span>{item.payment || "—"}</span>
              <span>{Math.round(item.expiry) + " hr(s)"}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground italic">
            No items to display
          </div>
        )}
      </div>
    </div>
  );
};

