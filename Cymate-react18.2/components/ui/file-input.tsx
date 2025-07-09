"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useFileUpload } from "@/lib/hooks/use-file-upload"

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  onUploadComplete?: (result: any) => void
  onUploadError?: (error: Error) => void
  value?: File | null
  onChange?: (file: File | null) => void
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, accept, multiple, onUploadComplete, onUploadError, value, onChange, ...props }, ref) => {
    const [file, setFile] = React.useState<File | null>(value || null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const { upload, progress, isUploading, error, reset } = useFileUpload({
      onComplete: onUploadComplete,
      onError: onUploadError,
    })

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      if (selectedFile) {
        setFile(selectedFile)
        onChange?.(selectedFile)
        try {
          await upload(selectedFile)
        } catch (err) {
          console.error("Upload failed:", err)
        }
      }
    }

    const handleCancel = () => {
      setFile(null)
      onChange?.(null)
      reset()
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{accept?.split(",").join(", ")} files only</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              {...props}
            />
          </label>
        </div>

        {/* {(file || isUploading || error) && (
          <div className="mt-4">
            <Progress
              value={progress}
              variant={error ? "error" : progress === 100 ? "success" : "default"}
              showValue
              label={error ? "Upload failed" : file?.name}
              sublabel={error ? error.message : isUploading ? `${Math.round(file?.size / 1024)} KB` : undefined}
              showCancel={!error && progress !== 100}
              onCancel={handleCancel}
            />
          </div>
        )} */}
      </div>
    )
  },
)
FileInput.displayName = "FileInput"

export { FileInput }
