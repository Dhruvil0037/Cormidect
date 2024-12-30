"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (url?: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ endpoint, value, onChange }) => {
  const fileType = value.split(".").pop();
  
  if (value && fileType) {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full object-cover"
        />
        <button
          onClick={() => onChange("")}
          className="!bg-destructive !text-destructive-foreground absolute top-0 right-0 p-1 shadow-sm rounded-full hover:!bg-destructive/90 active:!bg-destructive/80 transition"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="!bg-background">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(err) => {
          console.error(err);
        }}
        appearance={{
          label: "!text-foreground font-medium",
          allowedContent: "!text-muted",
          button: "!bg-primary !text-primary-foreground hover:!bg-primary/90 active:!bg-primary/80",
          uploadIcon: "!text-primary",
          container: "!bg-secondary border-2 border-dashed !border-muted"
        }}
      />
    </div>
  );
};

export default FileUpload;
