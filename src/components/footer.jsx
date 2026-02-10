import { Edit2, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { networkObject } from "../pages/network";

export const Footer = ({ adminDetails }) => {
  const admin = adminDetails || {
    username: 'Unknown',
    uniqueID: 'N/A',
    email: 'N/A',
    phoneNumber: 'N/A'
  };
  const [changingNumber, setIsChangingNumber] = useState(false);
  const [changingPassword, setIsChangingPassword] = useState(false);

  const changePhoneNumber = async () => {
    const newPhoneNumber = document.getElementById("new-phone-number").value.trim();

    if (
      newPhoneNumber &&
      /^\d{10}$/.test(newPhoneNumber)
    ) {
      if (await networkObject.isNetworkError()) {
        alert("Network Error");
        return;
      }

      setIsChangingNumber(true);
      try {
        const result = await networkObject.sendPostRequest(
          { phoneNumber: newPhoneNumber, adminID: admin.adminID },
          "/admin/add-phone-number"
        );

        if (result) {
          alert("Phone number successfully changed!");
        } else {
          alert("Failed to change phone number.");
        }
      } catch (err) {
        console.error(err);
        alert("Unexpected error while updating phone number.");
      } finally {
        setIsChangingNumber(false);
      }
    } else {
      alert("Please enter a valid 10-digit phone number.");
    }
  };

  const changePassword = async () => {
    const newPassword = document.getElementById("new-password").value.trim();

    if (
      newPassword &&
      /[a-zA-Z]/.test(newPassword) &&
      /[*&^%$#@!]/.test(newPassword) &&
      newPassword.length >= 8
    ) {
      if (await networkObject.isNetworkError()) {
        alert("Network Error");
        return;
      }

      setIsChangingPassword(true);
      try {
        const result = await networkObject.sendPostRequest(
          { newPassword, adminID: admin.adminID },
          "/admin/change-password"
        );

        if (result) {
          alert("Password successfully changed!");
        } else {
          alert("Failed to change password.");
        }
      } catch (err) {
        console.error(err);
        alert("Unexpected error while updating password.");
      } finally {
        setIsChangingPassword(false);
      }
    } else {
      alert(
        "Invalid password. Include letters, a special character, and at least 8 characters."
      );
    }
  };

  return (
    <footer className="py-12 px-6 md:px-20 border-t border-border/30 bg-card mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-12 max-w-5xl mx-auto">
        {/* Password Section */}
        <div className="flex flex-col space-y-3 text-sm">
          <span className="font-semibold text-foreground">New Password</span>
          <input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            className="p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none text-sm"
          />
          <button
            onClick={changePassword}
            disabled={changingPassword}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              changingPassword
                ? "bg-primary/70 text-white cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95"
            }`}
          >
            {changingPassword ? (
              <span className="flex items-center justify-center gap-2">
                <LoaderIcon size={16} className="animate-spin" /> Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>

        {/* Phone Number Section */}
        <div className="flex flex-col space-y-3 text-sm">
          <span className="font-semibold text-foreground">New Phone Number</span>
          <input
            id="new-phone-number"
            type="text"
            placeholder="Enter new phone number"
            className="p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none text-sm"
          />
          <button
            onClick={changePhoneNumber}
            disabled={changingNumber}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              changingNumber
                ? "bg-primary/70 text-white cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95"
            }`}
          >
            {changingNumber ? (
              <span className="flex items-center justify-center gap-2">
                <LoaderIcon size={16} className="animate-spin" /> Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>

      {/* Admin Details */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border/20">
        <div>
          <span className="font-medium text-foreground">Name:</span>{" "}
          {admin.username}
        </div>
        <div>
          <span className="font-medium text-foreground">Admin ID:</span>{" "}
          {admin.uniqueID}
        </div>
        <div>
          <span className="font-medium text-foreground">Email:</span>{" "}
          {admin.email}
        </div>
        <div>
          <span className="font-medium text-foreground">Contact:</span>{" "}
          {admin.phoneNumber}
        </div>
      </div>

      {/* Delete Button */}
      <div className="flex justify-center mt-10">
        <button className="px-6 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 hover:shadow-lg transition-all duration-300">
          Delete Admin
        </button>
      </div>

      {/* Footer note */}
      <p className="text-center text-sm mt-8 text-muted-foreground">
        &copy; {new Date().getFullYear()} chargedMatrix.co — All rights reserved
      </p>
    </footer>
  );
};
