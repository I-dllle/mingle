import type {
  LeaveType,
  AttendanceStatus,
} from "@/features/attendance/types/attendanceCommonTypes";

export const mapLeaveTypeToStatus = (type: LeaveType): AttendanceStatus => {
  switch (type) {
    case "ANNUAL":
      return "ON_ANNUAL_LEAVE";
    case "SICK":
      return "ON_SICK_LEAVE";
    case "OFFICIAL":
      return "ON_OFFICIAL_LEAVE";
    case "HALF_DAY_AM":
      return "ON_HALF_DAY_AM";
    case "HALF_DAY_PM":
      return "ON_HALF_DAY_PM";
    case "BUSINESS_TRIP":
      return "ON_BUSINESS_TRIP";
    case "MARRIAGE":
    case "BEREAVEMENT":
    case "PARENTAL":
      return "ON_SPECIAL_LEAVE";
    case "EARLY_LEAVE":
      return "EARLY_LEAVE";
    default:
      return "ABSENT";
  }
};
