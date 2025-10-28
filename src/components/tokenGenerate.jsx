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

  // Handle select input
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

  // Notify server and generate new token
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

  // Copy token to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card py-10 px-8 mx-auto my-10 rounded-xl shadow-lg max-w-2xl space-y-10">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-primary">Generate Access Token</h2>

      {/* Timeframe Selection */}
      <div className="flex flex-col space-y-4">
        <label className="text-lg font-semibold text-foreground">
          Select Timeframe
        </label>
        <select
          onChange={handleTimeFrameChange}
          className="bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          defaultValue="----select time frame------"
        >
          <option>----select time frame------</option>
          {clientTimeFrames.map((frame, index) => (
            <option key={index}>{frame}</option>
          ))}
        </select>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={notifyServerAbtNewToken}
          disabled={isSending}
          className={`px-6 py-3 rounded-full text-white font-medium transition-all duration-300 ${
            isSending
              ? "bg-primary/70 cursor-not-allowed"
              : "bg-primary hover:shadow-lg hover:scale-105"
          }`}
        >
          {isSending ? (
            <span className="flex items-center gap-2">
              <LoaderIcon className="animate-spin" size={18} /> Generating...
            </span>
          ) : (
            "Generate Token"
          )}
        </button>
      </div>

      {/* Token Display */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <span className="text-lg font-semibold text-foreground">
          Your Token Code:
        </span>
        <div className="flex items-center gap-3 bg-muted px-5 py-3 rounded-lg shadow-inner">
          <span
            id="token-code"
            className="text-xl font-bold tracking-wide text-primary break-all"
          >
            {currentCode || "No token yet"}
          </span>

          {currentCode && (
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-primary transition-all"
            >
              {copied ? (
                <span className="text-green-500 font-semibold">Copied!</span>
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
