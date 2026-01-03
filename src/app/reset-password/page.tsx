"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.services";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // using lucide-react as seen in your package.json
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AxiosError } from "axios";

function ResetPasswordContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// "Catch the link" -> Get token from URL query param
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!token) {
			setError("Invalid or missing reset token. Please request a new link.");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters long.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			setLoading(true);

			// Call the API
			await authService.resetPassword({
				token,
				newPassword: password
			});

			setSuccess(true);

			// Optional: Redirect after a few seconds
			setTimeout(() => {
				router.push("/"); // Redirect to home/login
			}, 3000);

		} catch (err) {
			console.error("Reset password error:", err);
			if (err instanceof AxiosError && err.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError("Failed to reset password. The link may have expired.");
			}
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
				<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
					<h2 className="text-2xl font-bold text-green-600">Success!</h2>
					<p className="text-gray-600">
						Your password has been reset successfully. You will be redirected to the login page shortly.
					</p>
					<Button onClick={() => router.push("/")} className="w-full mt-4">
						Go to Login
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Reset Password</h1>
					<p className="text-gray-500">Enter your new password below.</p>
				</div>

				{!token && (
					<div className="p-3 text-sm text-yellow-800 bg-yellow-100 rounded-md">
						Warning: No token found in the URL. This page must be accessed via the email link.
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">

					{/* New Password Input */}
					<div className="space-y-2">
						<Label htmlFor="password">New Password</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter new password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={loading}
								required
								className="pr-10"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
								disabled={loading}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4 text-gray-400" />
								) : (
									<Eye className="h-4 w-4 text-gray-400" />
								)}
							</Button>
						</div>
					</div>

					{/* Confirm Password Input */}
					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							placeholder="Confirm new password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={loading}
							required
						/>
					</div>

					{error && (
						<div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
							{error}
						</div>
					)}

					<Button type="submit" className="w-full" disabled={loading || !token}>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Resetting...
							</>
						) : (
							"Reset Password"
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}

// Wrap in Suspense for Next.js Client Component using useSearchParams
export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
			<ResetPasswordContent />
		</Suspense>
	);
}