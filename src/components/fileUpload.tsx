"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import {FileIcon,  X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (url?: string) => void;
  handleFileName?: (name: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ endpoint, value, onChange , handleFileName }) => {

  const [fileName, setFileName] = useState<string | null>(null);
  let fileType : string | undefined = value.split(".").pop();
  if(fileName){
    fileType = fileName?.split(".").pop()?.toLowerCase() || "";
  }

  const handleNameOfFile  = (name: string| null)=>{
    setFileName(name)
    if(handleFileName){
      handleFileName(name || "");
    }
  }
  
  if (value && fileType !== "pdf") {
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

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md ">
        <FileIcon className="size-10  stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm  dark:text-indigo-400 hover:underline"
        >
          {fileName}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500  p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          typeof="button"
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
          handleNameOfFile(res?.[0].name);
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
