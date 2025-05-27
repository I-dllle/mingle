package com.example.mingle.global.constants;


public class TimeConstants {

    private TimeConstants() {}

    // 근태 관련 상수 정의
    public static final int STANDARD_START_HOUR = 9;   // 출근 기준 - 오전 9시
    public static final int STANDARD_START_MINUTE = 0; // 출근 기준 - 0분
    public static final int STANDARD_END_HOUR = 18;    // 퇴근 기준 - 오후 6시
    public static final int STANDARD_END_MINUTE = 0;   // 퇴근 기준 - 0분
    public static final int OVERTIME_THRESHOLD_MINUTES = 10; // 야근 허용 유예 시간 (10분)

    public static final int AWAY_DELAY_SECONDS = 5;
}
