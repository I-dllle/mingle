"use client";

import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

interface DateTimePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder: string;
  minDate?: Date;
  showTimeSelect?: boolean;
  className?: string;
  disabled?: boolean;
}

const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  (
    {
      selectedDate,
      onChange,
      placeholder,
      minDate,
      showTimeSelect = true,
      className = "",
      disabled = false,
    },
    ref
  ) => {
    return (
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          showTimeSelect={showTimeSelect}
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText={placeholder}
          locale={ko}
          minDate={minDate}
          disabled={disabled}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 bg-white disabled:bg-gray-100 disabled:text-gray-500 ${className}`}
          calendarClassName="bg-white shadow-xl rounded-lg"
          showPopperArrow={false}
          timeCaption="시간"
          previousMonthButtonLabel="이전 달"
          nextMonthButtonLabel="다음 달"
        />
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";

export default DateTimePicker;
