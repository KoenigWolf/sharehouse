"use client";

/**
 * Profile Form Component
 * Form for editing resident profile (photo and nickname)
 */

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { getAvatarColor, getInitials, validateImageFile, validateNickname } from "@/src/lib/utils";
import { Button } from "@/components/ui/button";
import type { ProfileFormProps } from "../types";
import { Check, Save, Camera, Pencil, Home, Building2, AlertCircle } from "lucide-react";

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
        className="w-full h-12"
      >
        {isLoading ? (
          "Saving..."
        ) : success ? (
          <>
            <Check className="w-5 h-5" />
            Saved!
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Changes
          </>
        )}
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
        <Check className="w-5 h-5 text-emerald-500" />
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
                "absolute inset-0 bg-linear-to-br flex items-center justify-center",
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
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Edit badge */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Change photo"
          className={cn(
            "absolute -bottom-2 -right-2 w-10 h-10 rounded-xl",
            "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30",
            "flex items-center justify-center",
            "hover:bg-indigo-600 transition-colors"
          )}
        >
          <Pencil className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onPhotoChange}
        aria-label="Upload profile photo"
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
      <ReadOnlyField label="Room Number" value={roomNumber} icon={<Home className="w-4 h-4" />} />
      <ReadOnlyField label="Floor" value={floor} icon={<Building2 className="w-4 h-4" />} />
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
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
        <AlertCircle className="w-5 h-5 text-red-500" />
      </div>
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}

