"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ListDomain() {
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("useremail");
        const storedName = localStorage.getItem("username");
        if (storedEmail) setUserEmail(storedEmail);
        if (storedName) setFullName(storedName);
    }, []);

    const handleTogglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
        if (showPasswordFields) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/account-settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: userId,
                    full_name: fullName,
                    phone: phone,
                    company: company,
                }),
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "✅ Profile updated successfully!",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Update Failed",
                    text: data.message || "❌ Failed to update profile.",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "❌ An error occurred while updating profile.",
            });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (!currentPassword || !password || !confirmPassword) {
            return Swal.fire("⚠️ Error", "Please fill in all password fields", "warning");
        }

        if (password !== confirmPassword) {
            return Swal.fire("⚠️ Error", "New passwords do not match", "warning");
        }

        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/update-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: userId,
                    current_password: currentPassword,
                    new_password: password,
                    confirm_password: confirmPassword,
                }),
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire("✅ Success", "Password updated successfully", "success");
                setShowPasswordFields(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                Swal.fire("❌ Failed", data.message || "Failed to update password", "error");
            }
        } catch (error) {
            console.error("Password Update Error:", error);
            Swal.fire("❌ Error", "An error occurred while updating password", "error");
        }
    };

    return (
        <div className="rounded-lg border bg-white border-[#e2e8f0] text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Account Settings
                </h3>
                <p className="text-sm text-gray-500">
                    Manage your account details and notifications
                </p>
            </div>
            <div className="p-6 pt-0">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Name</label>
                        <input
                            className="flex h-10 w-full rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your full name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Email</label>
                        <input
                            className="flex h-10 w-full rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
                            value={userEmail}
                            readOnly
                        />
                        <p className="text-sm text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Phone (optional)</label>
                        <input
                            className="flex h-10 w-full rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Your Phone Number"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Company (optional)</label>
                        <input
                            className="flex h-10 w-full rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Your Company Name"
                        />
                    </div>

                    <div>
                        <button
                            className="bg-[#0b2e67] hover:bg-[#093065] text-white text-sm font-medium rounded-md px-4 py-2 h-9"
                            type="submit"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Section */}
            <div className="p-6 pt-0">
                <h3 className="text-xl font-semibold mb-4">Password Settings</h3>
                {!showPasswordFields ? (
                    <button
                        className="text-sm border border-[#e2e8f0] px-4 py-2 rounded-md hover:bg-gray-100"
                        onClick={handleTogglePasswordFields}
                        type="button"
                    >
                        Change Password
                    </button>
                ) : (
                    <form className="space-y-4" onSubmit={handlePasswordUpdate}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Current Password</label>
                            <input
                                type="password"
                                className="w-full h-10 rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">New Password</label>
                            <input
                                type="password"
                                className="w-full h-10 rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
                                value={password}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                className="w-full h-10 rounded-md border px-3 py-2 bg-[#f9fafb] border-[#e2e8f0]"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="bg-[#0b2e67] hover:bg-[#093065] text-white text-sm font-medium rounded-md px-4 py-2 h-9"
                                type="submit"
                            >
                                Update Password
                            </button>
                            <button
                                className="text-sm border border-[#e2e8f0] px-4 py-2 rounded-md hover:bg-gray-100"
                                onClick={handleTogglePasswordFields}
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
