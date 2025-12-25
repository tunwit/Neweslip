import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar } from "@mui/joy";
import Image from "next/image";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface AvatarProps {
  src?: string;
  fallbackTitle?: string;
  size?: number;
  onChange?: (file?: File) => void;
  onRemove?: () => void;
  editable?: boolean;
  allowRemove?: boolean;
}
export default function ChangableAvatar({
  src,
  fallbackTitle,
  size = 38,
  onChange,
  onRemove,
  editable = false,
  allowRemove = true,
}: AvatarProps) {
  const [url, setUrl] = useState(src);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUrl(src);
  }, [src]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function colorFromText(text?: string) {
    if (!text) return "#CDD7E1";
    const colors = ["#97C3F0", "#A1E8A1", "#F3C896", "#F09898"] as const;
    return colors[text.charCodeAt(0) % colors.length];
  }

  const handleClikChangeAvatar = () => {
    if (!editable) return;
    fileInputRef.current?.click();
  };

  const changeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!editable) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    objectUrlRef.current = objectUrl;
    setHasError(false);
    setUrl(objectUrl);
    if (onChange) onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allowRemove) return;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setUrl(undefined);
    onRemove?.();
  };
  return (
    <>
      <div
        style={{ width: size, height: size }}
        className={` ${editable ? "cursor-pointer" : "cursor-default"}`}
        onClick={handleClikChangeAvatar}
      >
        <div className="flex relative items-center justify-center h-full group">
          <div
            hidden={!editable}
            className="flex z-100 absolute items-center justify-center bg-black/50 rounded-full w-full h-full opacity-0 group-hover:opacity-100 duration-200 transition-all"
          >
            <Icon
              icon="tdesign:edit-filled"
              className="text-white"
              fontSize={25}
            />
            <div
              className="absolute border border-gray-600 right-0 top-0 z-150 bg-gray-800 hover:bg-black rounded-full p-1 group/delete transition-all"
              onClick={handleRemove}
              hidden={!allowRemove || !url}
            >
              <Icon
                icon="ic:baseline-delete"
                className="text-red-400 group-hover/delete:text-red-500 transition-all"
                fontSize={18}
              />
            </div>
          </div>
          {url && !hasError && !isLoading ? (
            <div
              style={{ width: size, height: size }}
              className="relative overflow-hidden rounded-full"
            >
              <Image
                src={url}
                alt="avatar"
                fill
                sizes={`${size}px`}
                unoptimized
                className="object-cover"
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                onLoadStart={() => setIsLoading(true)}
                onLoadingComplete={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <div
              style={{
                backgroundColor: colorFromText(fallbackTitle),
              }}
              className={`flex items-center justify-center w-full h-full text-gray-700 text-sm font-medium rounded-full`}
            >
              {fallbackTitle ? (
                fallbackTitle?.[0]?.toUpperCase()
              ) : (
                <Icon icon="mdi:user" fontSize={40} />
              )}
            </div>
          )}
        </div>
      </div>
      <input
        disabled={!editable}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => changeHandler(e)}
      />
    </>
  );
}
