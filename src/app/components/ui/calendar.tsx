"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0";
import { DayPicker } from "react-day-picker@8.10.1";

import { cn } from "./utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-0",
        caption: "flex justify-center pt-1 relative items-center w-full mb-4",
        caption_label: "text-[#242A56] text-center text-[16px] not-italic font-bold leading-[normal] font-bariol",
        nav: "flex items-center gap-1",
        nav_button: cn(
          "text-[#FF007F] font-bold bg-transparent p-0 hover:opacity-80 transition-opacity",
          "size-7"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex border-b border-[#E7E7EB] mb-4",
        head_cell:
          "text-[#242A56] text-center text-[16px] not-italic font-bold leading-[normal] font-bariol flex items-center justify-center w-[48px] h-[48px]",
        row: "flex w-full",
        cell: cn(
          "relative p-0 text-center focus-within:relative focus-within:z-20",
          "w-[48px] h-[48px]",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : ""
        ),
        day: cn(
          "w-[48px] h-[48px] p-0 font-bariol text-[16px] font-normal",
          "text-[#242A56] hover:bg-[#FFF5F6] rounded-md transition-colors",
          "aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-[#FF007F] aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-[#FF007F] aria-selected:text-white",
        day_selected:
          "bg-[#FF007F] text-white hover:bg-[#FF007F] hover:text-white focus:bg-[#FF007F] focus:text-white",
        day_today: "bg-[#FFF5F6] text-[#242A56] font-bold",
        day_outside:
          "day-outside text-[#CCCCCC] opacity-50 aria-selected:text-white",
        day_disabled: "text-[#CCCCCC] opacity-30 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-[#FFF5F6] aria-selected:text-[#242A56]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" className={className} {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M17.0303 2.96967C17.3232 3.26256 17.3232 3.73744 17.0303 4.03033L8.56066 12.5L17.0303 20.9697C17.3232 21.2626 17.3232 21.7374 17.0303 22.0303C16.7374 22.3232 16.2626 22.3232 15.9697 22.0303L6.96967 13.0303C6.67678 12.7374 6.67678 12.2626 6.96967 11.9697L15.9697 2.96967C16.2626 2.67678 16.7374 2.67678 17.0303 2.96967Z" fill="#FF007F"/>
          </svg>
        ),
        IconRight: ({ className, ...props }) => (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" className={className} {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M6.96967 22.0303C6.67678 21.7374 6.67678 21.2626 6.96967 20.9697L15.4393 12.5L6.96967 4.03033C6.67678 3.73744 6.67678 3.26256 6.96967 2.96967C7.26256 2.67678 7.73744 2.67678 8.03033 2.96967L17.0303 11.9697C17.3232 12.2626 17.3232 12.7374 17.0303 13.0303L8.03033 22.0303C7.73744 22.3232 7.26256 22.3232 6.96967 22.0303Z" fill="#FF007F"/>
          </svg>
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
