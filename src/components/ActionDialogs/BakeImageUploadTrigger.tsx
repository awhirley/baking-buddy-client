import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "#components/SharedComponents/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "#components/SharedComponents/ui/dialog";
import { BakeStorageService } from "../../services/BakeStorageService";
import { Input } from "#components/SharedComponents/ui/input";
import { cn } from "cn";
import { Camera } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "#components/SharedComponents/ui/tooltip";

interface BakeImageUploadTriggerProps {
  bakeId: string;
}

export function BakeImageUploadTrigger({ bakeId }: BakeImageUploadTriggerProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: () => BakeStorageService.uploadBakeImage(bakeId, file as File),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bakes", bakeId, "images"] });
      resetAndClose(true);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const resetAndClose = (closeDialog: boolean) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    uploadMutation.reset();
    setOpen(!closeDialog);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : resetAndClose(true))}>
      <DialogTrigger render={
        <Tooltip>
          <TooltipTrigger render={
            <Button
              className="self-start max-w-sm"
              size="icon"
              onClick={() => setOpen(true)}>
                <Camera />
            </Button>} />
          <TooltipContent className="flex flex-col gap-2">
            <p>Add a photo of your bake</p>
          </TooltipContent>
        </Tooltip>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a bake photo</DialogTitle>
        </DialogHeader>

        {!previewUrl && (
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file:mr-4 file:rounded-full file:bg-secondary file:px-4 file:text-secondary-foreground hover:file:bg-secondary/80"
          />
        )}

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Selected preview"
            className="max-h-64 w-full rounded-md object-contain"
          />
        )}

        {uploadMutation.isError && (
          <p className="text-sm text-destructive">
            Upload failed. Please try again.
          </p>
        )}

        <DialogFooter className={cn("sm:flex", previewUrl ? "sm:justify-between" : "sm:justify-end")}>
          {previewUrl && (
            <Button variant="ghost" onClick={() => resetAndClose(false)}>
              Clear selection
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => resetAndClose(true)}>
              Cancel
            </Button>
            <Button
              onClick={() => uploadMutation.mutate()}
              disabled={!file || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
