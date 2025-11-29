import { uploadEmployeeDocuments } from "@/app/action/uploadEmployeeDocument";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  CircularProgress,
  LinearProgress,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import React, { Dispatch, DragEventHandler, SetStateAction, useRef, useState } from "react";

interface FileProgress {
  fileName: string;
  progress: "uploading" | "uploaded";
  success?: boolean;
  error?: any;
}

const filesLimit = 5;
const statusSpan = {
  ready: (
    <span className="flex flex-row gap-1 items-center">
      <Icon
        icon="mdi:cloud-upload"
        className="text-blue-600 rounded-full"
        fontSize={15}
      />
      <p className="text-xs">ready</p>
    </span>
  ),
  uploading: (
    <span className="flex flex-row gap-1 items-center">
      <Icon icon="ph:spinner" className="animate-spin" fontSize={15} />
      <p className="text-xs">uploading</p>
    </span>
  ),
  uploaded: (
    <span className="flex flex-row gap-1 items-center">
      <Icon
        icon="lets-icons:check-fill"
        fontSize={15}
        className=" text-green-600"
      />
      <p className="text-xs">uploaded</p>
    </span>
  ),
};

interface UploadDocumentModalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    tag:string,
    employeeId:number
}
export default function UploadDocumentModal({open,setOpen,tag,employeeId}:UploadDocumentModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { user } = useUser();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [progressList, setProgressList] = useState<FileProgress[]>([]);
  const queryClient = useQueryClient()
  const { id:shopId } = useCurrentShop()
  const inputRef = useRef(null);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles([...files, ...dropped]);
  };

const onUploadHandler = async () => {
    if (!user?.id) return;
    if(!shopId) return
    setIsUploading(true);

    const existingSuccessfulProgress = progressList
        .filter(p => p.progress === "uploaded" && p.success === true);

    const uploadedFileNames = existingSuccessfulProgress.map(p => p.fileName);

    const filesToUpload = files.filter(f => !uploadedFileNames.includes(f.name));

    if (filesToUpload.length === 0) {
        setIsUploading(false);
        return;
    }

    const initialProgressForNewFiles = filesToUpload.map((f) => ({
      fileName: f.name,
      progress: "uploading" as const,
      success: undefined,
      error: undefined,
    }));
    
    setProgressList([...existingSuccessfulProgress, ...initialProgressForNewFiles]);

    try {
        const finalResults = await uploadEmployeeDocuments(
            filesToUpload,
            tag,
            employeeId,
            shopId,
            user?.id,
        );
        
        setProgressList((prev) => {
            const resultsMap = new Map(finalResults.map(r => [r.fileName, r]));
            
            return prev.map(p => {
                const result = resultsMap.get(p.fileName);
                
                if (result) {
                    return {
                        fileName: result.fileName,
                        progress: "uploaded" as const,
                        success: result.success,
                        error: result.error,
                    };
                }
                return p;
            });
        });

    } catch (error) {
        console.error("Fatal Upload Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Network error";
        
        setProgressList((prev) => prev.map((p) => {
            if (p.progress === "uploading") {
                 return {
                    ...p,
                    progress: "uploaded" as const,
                    success: false,
                    error: errorMessage,
                };
            }
            return p;
        }));
    } finally {
        setIsUploading(false);
        queryClient.invalidateQueries({queryKey:["employees","document", employeeId]})
    }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const incoming = Array.from(e.target.files);
        if(incoming.length + files.length > filesLimit){
            setError(`exceed file limit (${filesLimit})`)
            return
        }
        const duplicates: File[] = [];
        const newFiles: File[] = [];
        setError("")
        for (const file of incoming) {
            const isDup = files.some(
            (existing) =>
                existing.name === file.name &&
                existing.size === file.size &&
                existing.type === file.type
            );

            if (isDup) {
            duplicates.push(file);
            } else {
            newFiles.push(file);
            }
        }
        if (newFiles.length > 0) {
            setFiles((prev) => [...prev, ...newFiles]);
        }
        if(duplicates.length > 0){
            setError(`you cannot upload duplicate file  ${duplicates.map(f => f.name).join(", ")}`)
        }
        e.target.value = "";
    }
  };

  const onBrowseClick = () => {
    inputRef.current?.click();
  };

  const bytesToKB = (bytes: number) => {
    return (bytes / 1024).toFixed(2);
  };
  return (
    <Modal open={open} onClose={()=>setOpen(false)}>
      <ModalDialog>
        <ModalClose />
        <h1 className="font-bold text-xl">Document Uploader</h1>
        <section>
          <div
            className={`relative flex flex-col gap-2 justify-center items-center min-w-96 min-h-56 border border-dashed  rounded-md ${isDragOver ? "border-2 border-green-700" : "border-gray-400"}`}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
          >
            <div
              className={`absolute inset-[0.4px] flex flex-col justify-center items-center w-full h-full z-10 font-bold text-2xl bg-green-600/50 transition-all backdrop-blur-md rounded-md ${isDragOver ? "opacity-95 " : "opacity-0  pointer-events-none"}`}
            >
              <Icon
                className="mb-2 opacity-70 animate-bounce"
                icon="ic:round-download"
                fontSize={50}
              />
              <p className="text-black">Drop here!</p>
            </div>

            {files.length >= filesLimit && (
              <div
                className={`absolute inset-[0.4px] flex flex-col justify-center items-center w-full h-full z-10 font-bold text-2xl bg-red-400/50 transition-all backdrop-blur-md rounded-md opacity-95 `}
              >
                <Icon
                  className="mb-2 opacity-70 text-red-800"
                  icon="ion:ban"
                  fontSize={50}
                />
                <p className="text-black">File Limit</p>
                <p className="mt-1 text-sm font-normal">
                  you can only upload {filesLimit} files at a time
                </p>
              </div>
            )}
            <Icon
              className="mb-2 opacity-70"
              icon="line-md:upload-loop"
              fontSize={50}
            />
            <h1 className="font-semibold opacity-70">
              Choose a file or Drag and Drop file here
            </h1>
            <p className="text-sm opacity-50">Click button below to browse</p>
            <Button color="neutral" size="sm" onClick={onBrowseClick}>
              Browse
            </Button>
            <input
              ref={inputRef}
              disabled={files.length >= filesLimit}
              type="file"
              multiple
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-xs text-gray-400 font-light mt-2">
              Support format: PNG, JPG, WEBP, PDF
            </p>
            <p className="text-xs text-gray-400 font-light mt-2">
              Size limit: 10MB
            </p>
          </div>
        </section>
        <section className="flex flex-col gap-2">
          {files.length !== 0 && (
            <span className="flex flex-row gap-2">
                <p
                className={`text-sm  ${files.length >= filesLimit ? "text-red-800" : "text-gray-400"} `}
                >
                {files.length}/{filesLimit}
                </p>
                <p className={`text-sm  text-red-800`}> 
                    {error}
                </p>
            </span>
          )}
          {files.map((f, index) => {
            return (
              <div
                className="relative  bg-gray-200 p-3 w-full rounded-lg"
                key={index}
              >
                <button
                  hidden={progressList[index]?.progress !== undefined}
                  className="absolute right-3 bg-white border rounded-full"
                  onClick={() => {
                    setFiles(files.filter((_, i) => i !== index));
                  }}
                >
                  <Icon icon="basil:cross-solid" fontSize={15} />
                </button>
                <div className="flex flex-row gap-2 mb-2 items-center">
                  <img src="/fileIcons/pdf.svg" width={30} />
                  <div className="flex flex-col">
                    <p className="font-semibold text-md">{f.name}</p>
                    <div className="flex flex-row gap-2">
                      <p className="text-xs text-gray-500">
                        60 KB of {bytesToKB(f.size)}KB
                      </p>
                      {progressList[index]?.progress
                        ? statusSpan[progressList[index]?.progress]
                        : statusSpan["ready"]}
                    </div>
                  </div>
                </div>
                <LinearProgress
                  hidden={!(progressList[index]?.progress === "uploading")}
                  sx={{ marginTop: "8px" }}
                />
              </div>
            );
          })}

          {/* <div className='relative  bg-gray-200 p-3 w-full rounded-lg'>
                    <button className='absolute right-3 bg-white border rounded-full'>
                        <Icon icon="basil:cross-solid" fontSize={15}/>
                    </button>
                    <div className='flex flex-row gap-2 items-center'>
                        <img src="/fileIcons/pdf.svg" width={30}/>
                        <div className='flex flex-col'>
                            <p className='font-semibold text-md'>resume.pdf</p>
                            <div className='flex flex-row gap-2'>
                                <p className='text-xs text-gray-500'>60 KB of 100KB</p>
                                <span className='flex flex-row gap-1 items-center'>
                                    <Icon icon="lets-icons:check-fill" fontSize={15} className=' text-green-600'/>
                                    <p className='text-xs'>ready</p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <LinearProgress sx={{marginTop:"8px"}}/>
                </div> */}
        </section>
        <section className="flex gap-3 flex-row-reverse mt-2">
          <Button
            disabled={files.length < 1 || isUploading || progressList.length === files.length}
            loading={isUploading}
            onClick={onUploadHandler}
          >
            Upload
          </Button>
          <Button variant="outlined" onClick={()=>setOpen(false)}>Cancel</Button>
        </section>
      </ModalDialog>
    </Modal>
  );
}
