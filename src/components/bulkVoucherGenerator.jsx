import { useState } from "react";
import { jsPDF } from "jspdf";
import { FileDown, Loader2 } from "lucide-react";
import { SERVER_IP } from "../serverIP";

export const BulkVoucherGenerator = () => {
  const [quantity, setQuantity] = useState("");
  const [timeForEach, setTimeForEach] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generateVouchers = async () => {
    if (!quantity || !timeForEach) {
      setMessage("Please enter both quantity and time for each voucher");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${SERVER_IP}/session/generate-bulk-vouchers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: quantity,
            timeForEach: timeForEach,
          }),
        }
      );

      const data = await response.json();

      if (data.vouchers && Array.isArray(data.vouchers)) {
        // Generate PDF with vouchers
        generatePDF(data.vouchers);
        setMessage(`Successfully generated ${data.vouchers.length} vouchers!`);
      }
       else if (data.codes && Array.isArray(data.codes)) {
        // Handle alternative response format
        generatePDF(data.codes);
        setMessage(`Successfully generated ${data.codes.length} vouchers!`);
      } else if (data.voucherList && Array.isArray(data.voucherList)) {
        // Handle another possible response format
        generatePDF(data.voucherList);
        setMessage(`Successfully generated ${data.voucherList.length} vouchers!`);
      } else {
        console.error("Unexpected response format:", data);
        setMessage("Generated vouchers but couldn't parse the response");
      }
    } catch (error) {
      console.error("Error generating vouchers:", error);
      setMessage("Error generating vouchers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (vouchers) => {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Define theme colors
    const primaryColor = [0, 0, 139]; // Dark Blue
    const secondaryColor = [236, 72, 153]; // Pink
    
    // Add decorative header background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Header title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`TwistNet Vouchers`, pageWidth / 2, 15, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 24, {
      align: "center",
    });
    // Convert seconds to hours for display
    const hours = Math.floor(parseInt(timeForEach) / 3600);
    const displayTime = hours >= 1 ? `${hours} hour(s)` : `${timeForEach} seconds`;
    
    doc.setFontSize(10);
    doc.text(`Time: ${displayTime} | Total: ${vouchers.length} vouchers`, pageWidth / 2, 31, {
      align: "center",
    });
    
    // Reset text color for vouchers
    doc.setTextColor(0, 0, 0);
    
    // Font size for vouchers (28 as requested)
    const fontSize = 28;
    const lineHeight = fontSize * 0.7; // Increased padding between vouchers
    
    let yPosition = 50; // Start position after header
    let pageCount = 1;
    
    vouchers.forEach((voucher, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        // Add decorative header on new page
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`TwistNet Vouchers - Page ${pageCount + 1}`, pageWidth / 2, 15, {
          align: "center",
        });
        doc.setTextColor(0, 0, 0);
        yPosition = 40;
        pageCount++;
      }
      
      // Get the voucher code - handle different response formats
      let voucherCode = "";
      if (typeof voucher === "string") {
        voucherCode = voucher;
      } else if (voucher.voucherCode) {
        voucherCode = voucher.voucherCode;
      } else if (voucher.code) {
        voucherCode = voucher.code;
      } else if (voucher.voucher) {
        voucherCode = voucher.voucher;
      } else if (voucher.token) {
        voucherCode = voucher.token;
      }
      
      // Add index number and voucher code combined
      const indexText = `${index + 1}. `;
      const fullText = indexText + voucherCode;
      
      // Add voucher code (bold, font size 28)
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "bold");
      
      // Center the full text (index + voucher)
      const textWidth = doc.getTextWidth(fullText);
      const xPosition = (pageWidth - textWidth) / 2;
      
      // Add voucher code to PDF (bold and centered, no shadow)
      doc.setTextColor(0, 0, 0);
      doc.text(fullText, xPosition, yPosition);
      
      // Move to next line
      yPosition += lineHeight;
    });
    
    // Add footer with thank you message
    const footerY = pageHeight - 20;
    doc.setFillColor(...primaryColor);
    doc.rect(0, footerY - 5, pageWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for choosing TwistNet!", pageWidth / 2, footerY + 3, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("For any inquiries, feel free to call 0741882818", pageWidth / 2, footerY + 10, {
      align: "center",
    });
    
    // Save the PDF
    doc.save(`${hours} hr(s)-voucher(s)-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Number of Vouchers
        </label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Time for Each (e.g., 1h, 2h, 24h)
        </label>
        <input
          type="text"
          value={timeForEach}
          onChange={(e) => {
            const value = e.target.value;
            // Convert to seconds if format is recognized (e.g., 1h, 2h, 7d)
            let seconds = value;
            const hourMatch = value.match(/^(\d+)h$/i);
            const dayMatch = value.match(/^(\d+)d$/i);
            const minMatch = value.match(/^(\d+)m$/i);
            
            if (hourMatch) {
              seconds = (parseInt(hourMatch[1]) * 3600).toString();
            } else if (dayMatch) {
              seconds = (parseInt(dayMatch[1]) * 86400).toString();
            } else if (minMatch) {
              seconds = (parseInt(minMatch[1]) * 60).toString();
            }
            
            setTimeForEach(seconds);
          }}
          placeholder="e.g., 1h, 2h, 24h, 7d"
          className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
      
      <button
        onClick={generateVouchers}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg gradient-button font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4" />
            Generate & Download PDF
          </>
        )}
      </button>
      
      {message && (
        <p
          className={`text-sm ${
            message.includes("Error")
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};
