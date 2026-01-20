"use client";

import { useState } from "react";
import { Interview, InterviewLevel } from "@/types";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Select, Textarea } from "@/components/ui";

interface ScheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (interview: Omit<Interview, "id" | "createdAt" | "updatedAt" | "status">) => void;
  candidateId: string;
  jobOrderId: string;
  createdBy: string;
}

export function ScheduleInterviewDialog({
  open,
  onOpenChange,
  onSchedule,
  candidateId,
  jobOrderId,
  createdBy,
}: ScheduleInterviewDialogProps) {
  const [formData, setFormData] = useState({
    level: InterviewLevel.L1,
    scheduledAt: "",
    interviewerName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSchedule({
        candidateId,
        jobOrderId,
        level: formData.level,
        scheduledAt: new Date(formData.scheduledAt),
        interviewerName: formData.interviewerName || undefined,
        createdBy,
      });

      // Reset form
      setFormData({
        level: InterviewLevel.L1,
        scheduledAt: "",
        interviewerName: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to schedule interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="level">Interview Level</Label>
            <Select
              id="level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as InterviewLevel })}
              required
            >
              <option value={InterviewLevel.L1}>L1 - First Round</option>
              <option value={InterviewLevel.L2}>L2 - Second Round</option>
              <option value={InterviewLevel.L3}>L3 - Third Round</option>
              <option value={InterviewLevel.L4}>L4 - Final Round</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Scheduled Date & Time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewerName">Interviewer Name (Optional)</Label>
            <Input
              id="interviewerName"
              value={formData.interviewerName}
              onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
              placeholder="e.g., John Smith"
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
              {isLoading ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
