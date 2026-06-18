'use client';

import { useState, useRef } from 'react';
import { updateAvatar, removeAvatar } from '@/app/actions/avatar';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  userName: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AvatarUpload({ currentAvatarUrl, userName, size = 'lg' }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'text-[32px]',
    md: 'text-[40px]',
    lg: 'text-[48px]',
  };

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Upload to Cloudinary via our API
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'avatars');

      const response = await fetch('/api/v1/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      // Update the avatar URL in the database
      const formData = new FormData();
      formData.append('avatarUrl', data.url);

      const result = await updateAvatar(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      setPreviewUrl(data.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await removeAvatar();
      if (result.error) {
        throw new Error(result.error);
      }
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err.message || 'Failed to remove avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div className={`${sizeClasses[size]} rounded-full bg-surface-container overflow-hidden border-2 border-outline-variant relative flex items-center justify-center`}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : initials ? (
            <span className={`${iconSizes[size]} font-headline-sm text-on-surface-variant font-bold`}>
              {initials}
            </span>
          ) : (
            <span className={`material-symbols-outlined ${iconSizes[size]} text-on-surface-variant`}>person</span>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Camera overlay button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity border-2 border-surface-container-lowest disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">photo_camera</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-label-sm font-label-sm text-primary hover:underline disabled:opacity-50"
        >
          {previewUrl ? 'Change Photo' : 'Upload Photo'}
        </button>
        {previewUrl && (
          <>
            <span className="text-outline">·</span>
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={isUploading}
              className="text-label-sm font-label-sm text-error hover:underline disabled:opacity-50"
            >
              Remove
            </button>
          </>
        )}
      </div>

      {error && (
        <p className="text-label-sm font-label-sm text-error">{error}</p>
      )}
    </div>
  );
}
