"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      {/* Content */}
      {children}
    </div>
  );
};

const DialogContent = ({ children, className }: DialogContentProps) => {
  return (
    <div
      className={cn(
        "relative z-50 w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("mb-4", className)}>{children}</div>;
};

const DialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
};

const DialogDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };
