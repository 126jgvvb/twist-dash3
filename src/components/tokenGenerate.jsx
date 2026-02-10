import { Copy, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNewCode } from "../redux/defaultSlice";
import { networkObject } from "../pages/network";

const clientTimeFrames = [
  "1-HR",
  "6-HRS",
  "12-HRS",
  "24-HRS",
  "48-HRS(2Days)",
  "72-HRS(3Days)",
  "1-week",
  "1-month",
];

export const GenerateToken = ({ code }) => {
  const [selectedExpiry, setSelectedExpiry] = useState(null);
  const [isSending, setSending] = useState(false);
  const [currentCode, setCode] = useState(code);
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();

  const handleTimeFrameChange = (event) => {
    const value = event.target.value;
    if (value === "----select time frame------") {
      setSelectedExpiry(null);
      return;
    }

    const hours = value.split("-")[0];
    const expirySeconds = hours * 3600;
    setSelectedExpiry(expirySeconds);
  };

  const notifyServerAbtNewToken = async () => {
    if (!selectedExpiry) {
      alert("Please select a valid timeframe before generating a token.");
      return;
    }

    if (await networkObject.isNetworkError()) {
      alert("Network error. Please check your connection.");
      return;
    }

    setSending(true);

    try {
      const result = await networkObject.getNewVoucher(selectedExpiry);
      if (result?.code) {
        dispatch(setNewCode({ payload: result.code }));
        setCode(result.code);
        setSelectedExpiry(null);
      } else {
        alert("Failed to generate a new token.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setSending(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">
          Select Timeframe
        </label>
        <select
          onChange={handleTimeFrameChange}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
          defaultValue="----select time frame------"
        >
          <option className="bg-card text-foreground">----Select Time Base----</option>
          {clientTimeFrames.map((frame, index) => (
            <option key={index} className="bg-card text-foreground">
              {frame}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={notifyServerAbtNewToken}
        disabled={isSending}
        className={`w-full py-3 rounded-lg font-medium text-primary-foreground gradient-button transition-all duration-300 ${
          isSending ? "opacity-70 cursor-not-allowed" : "hover:scale-105 active:scale-95"
        }`}
      >
        {isSending ? (
          <span className="flex items-center justify-center gap-2">
            <LoaderIcon className="animate-spin" size={18} /> Generating...
          </span>
        ) : (
          "⚡ Generate Token"
        )}
      </button>

      <div className="space-y-3">
        <span className="text-sm font-medium text-muted-foreground">
          YOUR TOKEN CODE
        </span>
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/50">
          <span
            id="token-code"
            className="text-xl font-bold tracking-wide text-primary break-all"
          >
            {currentCode || "1234"}
          </span>
          
          {currentCode && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition-all"
            >
              {copied ? (
                <span className="text-green-500 font-semibold text-sm">Copied!</span>
              ) : (
                <Copy size={18} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
