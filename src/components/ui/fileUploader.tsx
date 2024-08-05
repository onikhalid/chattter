import React, { useState } from 'react';
import { Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { UploadIcon, TrashIcon } from '../icons';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  control: any; // or use your specific type for control
  name: string;
  label: string;
  acceptedFormats: string;
  acceptedFileExtensions: string;
  maxSize: number;
  color: "white" | "default"
  className?: string
  labelclassName?: string
  uploadTextClassName?: string
  mini?: boolean;
  errors?: { [key: string]: { message?: string | undefined } } | FieldErrors<FieldValues>;

}

const FileUploader: React.FC<FileUploadProps> = ({ control, name, label, acceptedFormats, acceptedFileExtensions, maxSize, color, className, labelclassName, uploadTextClassName, mini, errors }) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }: { field: FieldValues['field'] }) => (
        <>
          <div className={cn("inputdiv rounded-lg w-full border-[1.75px]", file !== null ? "justify-between z-40  shrink-0 flex items-center" : "",
            file == null && color === "default" && "bg-[#F5F7F9]",
            file !== null && color === "default" && "bg-[#F6F5FF] ",
            file == null && color === "white" && "bg-white/20 backdrop-blur-lg text-white",
            file !== null && color === "white" && "bg-[#ffffff] text-primary",
            file !== null && color === "default" && mini && "bg-[#F5F7F9] text-header-text",
            errors && errors[name] && "border-red-500" || "border-transparent",
            className

          )}>
            <label htmlFor={`upload-${name}`} className={cn("flex items-center cursor-pointer rounded-lg h-[5rem] p-6 gap-x-[1.31rem] w-full shrink-0", file === null ? "" : "", labelclassName, mini && "p-2.5 h-max")}>
              <div className={cn("h-8 w-8 rounded-full",
                color === "white" ? "bg-primary-light-active text-white" : "bg-[#F5F7F9] text-[#4A4A68]",
                mini && "hidden"
              )}>
                <UploadIcon />
              </div>

              <div className={cn("text-primary ", mini && "grow !flex items-center gap-2 flex-wrap")}>
                <input
                  onChange={(e) => {
                    field?.onChange(e.target.files && e.target.files[0], setFile(e.target.files && e.target.files[0]));
                  }}
                  type='file'
                  id={`upload-${name}`}
                  className='hidden'
                  name={`upload-${name}`}
                  accept={acceptedFormats}
                />
                <p className={cn('font-medium text-sm overflow-hidden whitespace-nowrap md:text-base !max-w-[27ch] text-ellipsis ',
                  file !== null && color === "white" && "text-primary",
                  file === null && color === "white" && "text-white", uploadTextClassName,
                  mini && "!max-w-[10ch]",
                  color === "default" && "text-header-text")
                }
                >
                  <span className='lg:hidden'>
                    {
                      file !== null ?
                        file?.name
                        :
                        mini ?
                          `Upload ${label}`
                          :
                          `Tap to upload ${label}`
                    }
                  </span>

                  <span className={cn('max-lg:hidden', mini && "text-sm font-normal bg-white rounded-md px-4 py-2.5")}>
                    {
                      file !== null ?
                        file?.name
                        :
                        mini ?
                          `Upload ${label}`
                          :
                          `Click to upload ${label}`
                    }
                  </span>
                </p>
                {
                  file !== null ?
                    <p className={cn(' text-sm opacity-60 max-xs:text-xs w-full', color === "white" ? "text-[#a8a8b7]" : "text-[#4A4A68]", mini && "w-max")}>Tap on <span className='text-primary font-medium'>change</span> to select another {label.toLowerCase()}</p>
                    :
                    <p className={cn('text-sm opacity-60 max-xs:text-xs', color === "white" ? "text-[#ede8e8]" : "text-[#4A4A68]")}>Files types:{acceptedFileExtensions} Max file size {maxSize}MB</p>

                }
              </div>

              {
                file !== null && (
                  <div className="h-full ml-auto " onClick={(e) => { e.preventDefault(); setFile(null) }} >
                    <TrashIcon className='cursor-pointer ' />
                  </div>
                )
              }
            </label>

          </div>

          <span className='text-red-500 text-sm'>
            {errors && errors[name] && `${errors[name]!!.message}`}
          </span>
        </>

      )}
    />
  );
};

export default FileUploader;
