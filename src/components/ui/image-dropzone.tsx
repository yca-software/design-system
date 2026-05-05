import { ImagePlus, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

interface ImageDropzoneProps {
  value: File | null;
  existingImageUrl?: string;
  removeExistingImage?: boolean;
  onRemoveExistingImageChange?: (value: boolean) => void;
  onChange: (file: File | null) => void;
  translations?: ImageDropzoneTranslations;
}

interface ImageDropzoneTranslations {
  imageAlt?: string;
  dropHintText?: string;
  chooseImageText?: string;
  removeText?: string;
  removeExistingImageText?: string;
}

const DEFAULT_TRANSLATIONS: Required<ImageDropzoneTranslations> = {
  imageAlt: "Image",
  dropHintText: "Drag and drop an image here, or choose a file.",
  chooseImageText: "Choose image",
  removeText: "Remove",
  removeExistingImageText: "Remove existing image",
};

function ImageDropzone({
  value,
  existingImageUrl,
  removeExistingImage = false,
  onRemoveExistingImageChange,
  onChange,
  translations,
}: ImageDropzoneProps) {
  const t = { ...DEFAULT_TRANSLATIONS, ...translations };
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const nextUrl = URL.createObjectURL(value);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [value]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    onChange(file);
    onRemoveExistingImageChange?.(false);
  };

  const displayedImage =
    previewUrl ?? (!removeExistingImage ? existingImageUrl : undefined);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
      />

      <div
        className={[
          "rounded-md border-2 border-dashed p-4 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
        ].join(" ")}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0] ?? null;
          handleFile(file);
        }}
      >
        {displayedImage ? (
          <img
            src={displayedImage}
            alt={t.imageAlt}
            className="mb-3 h-44 w-full rounded-md border object-cover"
          />
        ) : (
          <div className="mb-3 flex h-32 items-center justify-center rounded-md border bg-muted/20">
            <ImagePlus className="h-8 w-8 text-muted-foreground" aria-hidden />
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{t.dropHintText}</p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {t.chooseImageText}
            </Button>
            {value && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onChange(null)}
              >
                {t.removeText}
              </Button>
            )}
          </div>
        </div>
      </div>

      {existingImageUrl &&
      onRemoveExistingImageChange &&
      t.removeExistingImageText ? (
        <label className="flex items-center justify-between rounded-md border px-3 py-2">
          <span className="text-xs text-muted-foreground">
            {t.removeExistingImageText}
          </span>
          <Checkbox
            checked={removeExistingImage}
            onCheckedChange={(checked) =>
              onRemoveExistingImageChange(checked === true)
            }
          />
        </label>
      ) : null}
    </div>
  );
}

export { ImageDropzone };
