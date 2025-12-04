"use client";

/**
 * Profile Form Component
 * Form for editing resident profile (photo and nickname)
 */

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { getAvatarColor, getInitials, validateImageFile, validateNickname } from "@/src/lib/utils";
import { Button } from "@/src/shared/ui";
import type { ProfileFormProps } from "../types";

export function ProfileForm({ resident, onSuccess }: ProfileFormProps) {
  const [nickname, setNickname] = useState(resident.nickname);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayPhoto = photoPreview || resident.photo_url;
  const avatarColor = getAvatarColor(nickname || resident.nickname);
  const initials = getInitials(nickname || resident.nickname);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nicknameValidation = validateNickname(nickname);
    if (!nicknameValidation.valid) {
      setError(nicknameValidation.error!);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call (in production, would use actual API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success Message */}
      {success && <SuccessMessage />}

      {/* Photo Section */}
      <PhotoUpload
        displayPhoto={displayPhoto}
        avatarColor={avatarColor}
        initials={initials}
        nickname={nickname}
        fileInputRef={fileInputRef}
        onPhotoChange={handlePhotoChange}
      />

      {/* Form Fields */}
      <div className="space-y-6">
        <NicknameField value={nickname} onChange={setNickname} />
        <RoomInfo roomNumber={resident.room_number} floor={resident.floor} />
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || success}
        className="w-full py-4"
        leftIcon={isLoading ? undefined : success ? <CheckIcon /> : <SaveIcon />}
      >
        {isLoading ? "Saving..." : success ? "Saved!" : "Save Changes"}
      </Button>
    </form>
  );
}

function SuccessMessage() {
  return (
    <div
      className={cn(
        "p-4 rounded-2xl animate-scale-in flex items-center gap-3",
        "bg-emerald-50 dark:bg-emerald-900/20",
        "border border-emerald-200 dark:border-emerald-800"
      )}
    >
      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
        <CheckIcon className="w-5 h-5 text-emerald-500" />
      </div>
      <div>
        <p className="font-medium text-emerald-800 dark:text-emerald-200">
          Profile updated!
        </p>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Redirecting to home...
        </p>
      </div>
    </div>
  );
}

interface PhotoUploadProps {
  displayPhoto: string | null;
  avatarColor: string;
  initials: string;
  nickname: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function PhotoUpload({
  displayPhoto,
  avatarColor,
  initials,
  nickname,
  fileInputRef,
  onPhotoChange,
}: PhotoUploadProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white dark:ring-slate-700">
          {displayPhoto ? (
            <Image
              src={displayPhoto}
              alt={nickname}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
                avatarColor
              )}
            >
              <span className="text-4xl font-bold text-white drop-shadow-sm">
                {initials}
              </span>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
              <div className="absolute -top-2 -left-2 w-10 h-10 bg-white/10 rounded-full" />
            </div>
          )}

          {/* Hover overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-black/50",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "flex items-center justify-center cursor-pointer"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <CameraIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Edit badge */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "absolute -bottom-2 -right-2 w-10 h-10 rounded-xl",
            "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30",
            "flex items-center justify-center",
            "hover:bg-indigo-600 transition-colors"
          )}
        >
          <EditIcon className="w-5 h-5" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onPhotoChange}
        className="hidden"
      />

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Click the photo to change it
      </p>
    </div>
  );
}

interface NicknameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function NicknameField({ value, onChange }: NicknameFieldProps) {
  return (
    <div>
      <label
        htmlFor="nickname"
        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
      >
        Nickname
      </label>
      <input
        id="nickname"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        maxLength={50}
        className={cn(
          "w-full px-4 py-3 rounded-xl",
          "bg-slate-50 dark:bg-slate-700/50",
          "border border-slate-200 dark:border-slate-600",
          "text-slate-800 dark:text-slate-200",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          "transition-all duration-200"
        )}
        placeholder="Enter your nickname"
      />
    </div>
  );
}

interface RoomInfoProps {
  roomNumber: string;
  floor: string;
}

function RoomInfo({ roomNumber, floor }: RoomInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ReadOnlyField label="Room Number" value={roomNumber} icon={<HomeIcon />} />
      <ReadOnlyField label="Floor" value={floor} icon={<BuildingIcon />} />
    </div>
  );
}

interface ReadOnlyFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function ReadOnlyField({ label, value, icon }: ReadOnlyFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      <div
        className={cn(
          "px-4 py-3 rounded-xl flex items-center gap-2",
          "bg-slate-100 dark:bg-slate-700/30",
          "border border-slate-200 dark:border-slate-600",
          "text-slate-500 dark:text-slate-400"
        )}
      >
        {icon}
        {value}
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className={cn(
        "p-4 rounded-2xl flex items-center gap-3 animate-scale-in",
        "bg-red-50 dark:bg-red-900/20",
        "border border-red-200 dark:border-red-800"
      )}
    >
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
        <AlertIcon className="w-5 h-5 text-red-500" />
      </div>
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-8 h-8", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
