"use client";

import { useState } from "react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Label, Input } from "@/components/ui";

interface JoiningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoined: (joinDate: Date) => void;
  expectedDate: Date;
}

export function JoiningDialog({
  open,
  onOpenChange,
  onJoined,
  expectedDate,
}: JoiningDialogProps) {
  const [joinDate, setJoinDate] = useState(
    expectedDate.toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onJoined(new Date(joinDate));
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to mark as joined:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark as Joined</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Record the candidate's actual joining date.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="joinDate">Actual Joining Date</Label>
            <Input
              id="joinDate"
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Confirm Joining"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
