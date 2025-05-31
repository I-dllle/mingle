// features/reservation/components/RoomAvailabilityCalendar.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, addDays, subDays, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { RoomWithReservations } from "../types/roomWithReservations";
import styles from "../styles/calendar.module.css";

interface Props {
  rooms: RoomWithReservations[];
  currentUserId: number;
  date: string;
  onSelect: (
    reservationId: number,
    newReservationData?: { roomId: number; date: string; startTime: string }
  ) => void;
}

export function RoomAvailabilityCalendar({
  rooms,
  currentUserId,
  date,
  onSelect,
}: Props) {
  // 1) 선택된 날짜(문자열 → Date 객체) + 스크롤 참조
  const [selectedDate, setSelectedDate] = useState(parseISO(date));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 2) 시간대(0시~23시) 배열
  const startHour = 0;
  const endHour = 23;
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  // ───────────────────────────────────────────────────────────────
  // “selectedDate” 가 바뀔 때마다 스크롤을 조절하는 통합 로직
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    // 1) 현재 날짜(YYYY-MM-DD) 문자열과 비교
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const selDateStr = format(selectedDate, "yyyy-MM-dd");

    if (selDateStr === todayStr) {
      // ──────────────────────────────────────────────
      //  “오늘”인 경우: 현재 시간 기준으로 스크롤
      // ──────────────────────────────────────────────
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // (예) “09시 30분”이라면, (9 * 60 + 30) / 60 * 100 px 만큼 왼쪽에서 떨어진 지점
      const pixelsPerHour = 100;
      const scrollPosition =
        ((currentHour * 60 + currentMinute) / 60) * pixelsPerHour;

      scrollContainerRef.current.scrollLeft = scrollPosition;

      // “오늘”일 때만 1분마다 현재 시간을 기준으로 다시 스크롤을 갱신
      const timer = setInterval(() => {
        const now2 = new Date();
        const h2 = now2.getHours();
        const m2 = now2.getMinutes();
        const pos2 = ((h2 * 60 + m2) / 60) * pixelsPerHour;
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = pos2;
        }
      }, 60 * 1000);

      return () => clearInterval(timer);
    } else {
      // ──────────────────────────────────────────────
      //  “오늘이 아닐 경우”: 무조건 맨 왼쪽(00시)으로 스크롤
      // ──────────────────────────────────────────────
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [selectedDate]);

  // 4) “부모(dateChange 이벤트)”로 선택 날짜가 바뀌었을 때 최신화
  useEffect(() => {
    const newDateStr = format(selectedDate, "yyyy-MM-dd");
    if (newDateStr !== date) {
      window.dispatchEvent(
        new CustomEvent("dateChange", { detail: { date: newDateStr } })
      );
    }
  }, [selectedDate, date]);

  // 1) 렌더링 직전에 rooms 배열을 복사해서 'roomName' 기준으로 정렬
  const sortedRooms: RoomWithReservations[] = React.useMemo(() => {
    return [...rooms].sort((a, b) =>
      // 한글/영문/숫자 순서대로 정렬
      a.roomName.localeCompare(b.roomName, "ko")
    );
  }, [rooms]);

  // 5) 오늘/과거 여부 계산
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const todayObj = new Date();
  const todayStr = format(todayObj, "yyyy-MM-dd");
  const nowHour = todayObj.getHours();
  const selectedDateTs = new Date(dateStr).setHours(0, 0, 0, 0);
  const todayZeroTs = new Date(todayStr).setHours(0, 0, 0, 0);
  const isPastDate = selectedDateTs < todayZeroTs;
  const isToday = dateStr === todayStr;

  return (
    <div
      className={`${styles.calendarContainer} bg-white rounded-xl shadow-md ring-1 ring-gray-100/80 overflow-hidden h-[calc(100vh-200px)]`}
    >
      {/* ───────────────────────────────────────────
          1) 달력 바디(헤더 제거 버전):
             좌측: “방 이름” 고정 열
             우측: “시간 슬롯 + 예약 카드” 그리드
         ─────────────────────────────────────────── */}
      <div className="overflow-hidden">
        <div className="flex">
          {/* ─────────────────────────────────────────
              좌측 “방 이름” 고정 열
             ───────────────────────────────────────── */}{" "}
          <div className={`flex-none ${styles.roomNameCell}`}>
            {" "}
            <div className="h-15 bg-violet-50/80 border-b border-gray-100 flex items-center px-4 text-sm font-semibold text-violet-700">
              {rooms[0]?.roomType === "MEETING_ROOM"
                ? "회의실 예약"
                : "연습실 예약"}
            </div>
            {sortedRooms.map((room) => (
              <div
                key={room.roomId}
                className="h-16 flex items-center px-3 border-b border-gray-100 hover:bg-gray-50/70 transition duration-150"
              >
                <div className="flex items-center space-x-2">
                  <div className="font-medium text-gray-800">
                    {room.roomName.replace(/\d+$/, "")}
                  </div>
                  {room.roomName.match(/\d+$/)?.[0] && (
                    <div className="px-1.5 py-0.5 bg-violet-100/80 text-violet-600 text-xs rounded-md font-semibold shadow-sm">
                      {room.roomName.match(/\d+$/)?.[0] || ""}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* ─────────────────────────────────────────
              우측 “시간 슬롯(00~23시) + 예약 카드”
             ───────────────────────────────────────── */}{" "}
          <div
            className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-gray-50"
            ref={scrollContainerRef}
          >
            <div className="relative" style={{ minWidth: "100%" }}>
              {" "}
              <div
                className={styles.calendarGrid}
                style={{
                  gridTemplateColumns: `repeat(${hours.length}, 150px)`,
                }}
              >
                {/* 2-1) 시간 헤더 (00:00~23:00) */}
                {hours.map((hour) => (
                  <div key={hour} className={styles.timeHeader}>
                    {String(hour).padStart(2, "0")}:00
                  </div>
                ))}
                {/* 2-2) 현재 시간 인디케이터 */}{" "}
                {isToday && (
                  <div
                    className={styles.currentTimeIndicator}
                    style={{
                      left: `${
                        ((todayObj.getHours() * 60 + todayObj.getMinutes()) /
                          60) *
                        150
                      }px`,
                      height: `${rooms.length * 12 + 9}px`,
                    }}
                  >
                    <div className={styles.currentTimeDot}></div>
                  </div>
                )}
                {/* 2-3) 각 방별 시간 슬롯 + 예약 카드 */}
                {rooms.map((room) =>
                  hours.map((hour) => {
                    const startTime = `${String(hour).padStart(2, "0")}:00`;
                    const endTime = `${String(hour + 1).padStart(2, "0")}:00`;

                    // (가) 과거 슬롯 판정
                    const isPastSlot =
                      isPastDate || (isToday && hour < nowHour);

                    // (나) 이 슬롯에 예약이 있는지 검사
                    const reservationsInSlot = room.reservations.filter(
                      (res) => {
                        return (
                          res.date === dateStr &&
                          res.reservationStatus !== "CANCELED" &&
                          ((res.startTime <= startTime &&
                            res.endTime > startTime) ||
                            (res.startTime >= startTime &&
                              res.startTime < endTime))
                        );
                      }
                    );

                    let reservationId = -1;
                    let isMine = false;
                    let reservationIsPast = false;

                    if (reservationsInSlot.length > 0) {
                      const r = reservationsInSlot[0];
                      isMine = r.userId === currentUserId;
                      reservationId = r.id;

                      // “예약 종료 시각”이 현재 시간 이전이면 과거 예약
                      const endTs = new Date(`${r.date}T${r.endTime}`);
                      if (new Date() > endTs) {
                        reservationIsPast = true;
                      }
                    }

                    return (
                      <div
                        key={`${room.roomId}-${hour}`}
                        className={`${styles.timeSlot} ${
                          hour % 2 === 0
                            ? styles.evenTimeSlot
                            : styles.oddTimeSlot
                        } ${isPastSlot ? styles.pastTimeSlot : ""}`}
                        onClick={() => {
                          if (isPastSlot) return; // 과거 슬롯 클릭 금지

                          if (reservationsInSlot.length > 0) {
                            // (1) 예약이 있으면 → 상세 모달 열기
                            onSelect(reservationId);
                          } else {
                            // (2) 빈 슬롯 클릭 → 신규 예약 폼
                            onSelect(-1, {
                              roomId: room.roomId,
                              date: dateStr,
                              startTime,
                            });
                          }
                        }}
                      >
                        {reservationsInSlot.length > 0 && (
                          <div
                            className={`${styles.reservation} ${
                              reservationIsPast
                                ? styles.pastReservation
                                : isMine
                                ? styles.myReservation
                                : styles.otherReservation
                            }`}
                          >
                            <span
                              className={`text-xs truncate font-medium ${
                                reservationIsPast
                                  ? "text-gray-600"
                                  : isMine
                                  ? "text-violet-700"
                                  : "text-purple-700"
                              }`}
                            >
                              {reservationsInSlot[0].title ||
                                (isMine
                                  ? "내 예약"
                                  : `${reservationsInSlot[0].userName}님의 예약`)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
