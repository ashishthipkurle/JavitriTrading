"use client";

import { useState } from "react";
import { createClientAccountByEmployee } from "@/app/actions/employee";

export default function CreateClientForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [panFile, setPanFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFile = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "kyc_documents");

    const res = await fetch("/api/v1/upload", {
      method: "POST",
      body: uploadData,
    });

    if (!res.ok) throw new Error("File upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    if (!panFile || !aadhaarFile) {
      setError("Please upload both PAN and Aadhaar documents");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Upload Images First
      const panDocUrl = await uploadFile(panFile);
      const aadhaarDocUrl = await uploadFile(aadhaarFile);

      const payload = {
        ...formData,
        panDocUrl,
        aadhaarDocUrl
      };

      const result = await createClientAccountByEmployee(payload);

      if (result.success) {
        setSuccess("Client account successfully created and assigned to your portfolio.");
        setFormData({ name: "", email: "", phone: "", password: "" });
        setPanFile(null);
        setAadhaarFile(null);
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during client creation.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      {error && (
        <div className="bg-error-container text-on-error-container p-unit-md rounded-lg font-label-md">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-secondary-container/20 border border-secondary text-secondary p-unit-md rounded-lg font-label-md">
          {success}
        </div>
      )}

      <h4 className="text-label-md font-label-md text-primary font-bold border-b border-outline-variant pb-1">Personal Details</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-label-sm text-on-surface-variant">Full Name</label>
          <input 
            type="text" 
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-label-sm text-on-surface-variant">Email</label>
          <input 
            type="email" 
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-label-sm text-on-surface-variant">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-label-sm text-on-surface-variant">Temporary Password</label>
          <input 
            type="password" 
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <h4 className="text-label-md font-label-md text-primary font-bold border-b border-outline-variant pb-1 mt-2">KYC Details</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-label-sm text-on-surface-variant">Upload PAN Card Image</label>
          <input 
            type="file" 
            name="panFile"
            accept="image/*"
            required
            onChange={(e) => setPanFile(e.target.files?.[0] || null)}
            className="bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-label-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-label-sm font-label-sm text-on-surface-variant">Upload Aadhaar Card Image</label>
          <input 
            type="file" 
            name="aadhaarFile"
            accept="image/*"
            required
            onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)}
            className="bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-label-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-primary text-on-primary px-6 py-2 mt-2 rounded-lg font-bold hover:brightness-90 transition-all self-start disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
