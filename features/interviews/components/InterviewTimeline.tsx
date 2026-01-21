"use client";

import { Interview, InterviewLevel } from "@/types";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

interface InterviewTimelineProps {
  interviews: Interview[];
  onMarkCompleted?: (interviewId: string, level: string) => void;
  canEdit?: boolean;
}

export function InterviewTimeline({ interviews, onMarkCompleted, canEdit = false }: InterviewTimelineProps) {
  const sortedInterviews = [...interviews].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  if (interviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No interviews scheduled yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedInterviews.map((interview, index) => {
        const isCompleted = interview.status === "COMPLETED";
        const isPast = new Date(interview.scheduledAt) < new Date();

        return (
          <div
            key={interview.id}
            className={`border rounded-lg p-4 ${
              isCompleted ? "bg-muted/50" : "bg-card"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3 flex-1">
                <div className={`mt-1 ${isCompleted ? "text-green-600" : "text-blue-600"}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      Interview {interview.level}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isCompleted ? "Completed" : "Scheduled"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(interview.scheduledAt), "PPpp")}
                  </div>

                  {interview.interviewerName && (
                    <p className="text-sm text-muted-foreground">
                      Interviewer: {interview.interviewerName}
                    </p>
                  )}

                  {interview.feedback && (
                    <div className="mt-2 p-3 bg-muted rounded text-sm">
                      <p className="font-medium mb-1">Feedback:</p>
                      <p className="text-muted-foreground">{interview.feedback}</p>
                    </div>
                  )}

                  {interview.outcome && (
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          interview.outcome === "HIRED"
                            ? "bg-green-100 text-green-700"
                            : interview.outcome === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : interview.outcome === "NEXT_INTERVIEW"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {interview.outcome.replace(/_/g, " ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {canEdit && !isCompleted && (
                <button
                  onClick={() => onMarkCompleted?.(interview.id, interview.level)}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition"
                >
                  Complete Interview
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
