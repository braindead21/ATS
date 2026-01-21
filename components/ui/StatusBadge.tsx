import { CandidateStatus, JobOrderStatus } from "@/lib/constants/enums";

interface StatusBadgeProps {
  status: CandidateStatus | JobOrderStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      // Candidate statuses
      case CandidateStatus.NO_CONTACT:
        return "bg-gray-100 text-gray-700";
      case CandidateStatus.CONTACTED:
        return "bg-blue-100 text-blue-700";
      case CandidateStatus.QUALIFIED:
        return "bg-green-100 text-green-700";
      case CandidateStatus.REJECTED:
        return "bg-red-100 text-red-700";
      case CandidateStatus.ON_HOLD:
        return "bg-yellow-100 text-yellow-700";
      case CandidateStatus.NEXT_INTERVIEW:
        return "bg-purple-100 text-purple-700";
      case CandidateStatus.HIRED:
        return "bg-emerald-100 text-emerald-700";
      case CandidateStatus.OFFERED:
        return "bg-blue-100 text-blue-700";
      case CandidateStatus.OFFER_ACCEPTED:
        return "bg-green-100 text-green-700";
      case CandidateStatus.OFFER_DECLINED:
        return "bg-red-100 text-red-700";
      case CandidateStatus.JOINED:
        return "bg-indigo-100 text-indigo-700";
      case CandidateStatus.SUCCESSFUL_HIRE:
        return "bg-emerald-100 text-emerald-700";
      case CandidateStatus.BAD_DELIVERY:
        return "bg-orange-100 text-orange-700";
      case CandidateStatus.TERMINATED:
        return "bg-red-100 text-red-700";
      // Job Order statuses
      case JobOrderStatus.OPEN:
        return "bg-green-100 text-green-700";
      case JobOrderStatus.ON_HOLD:
        return "bg-yellow-100 text-yellow-700";
      case JobOrderStatus.CLOSED:
        return "bg-gray-100 text-gray-700";
      case JobOrderStatus.CANCELLED:
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
