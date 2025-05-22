package com.example.mingle.domain.attendance.attendance.service;

import com.example.mingle.domain.attendance.attendance.dto.AttendanceExcelDto;
import com.example.mingle.domain.attendance.attendance.entity.Attendance;
import com.example.mingle.domain.attendance.attendance.repository.AttendanceRepository;
import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceExcelService {

    private final AttendanceRepository attendanceRepository;

    // 데이터 조회 및 DTO 가공 및 엑셀 다운로드 생성
    @Transactional(readOnly = true)
    public byte[] downloadAttendanceExcel(LocalDate startDate,
                                          LocalDate endDate,
                                          Long departmentId,
                                          Long userId,
                                          String keyword,
                                          AttendanceStatus status) throws IOException {

        List<Attendance> attendances = attendanceRepository.findAllWithFilters(
                startDate, endDate, departmentId, userId, keyword, status
        );

        List<AttendanceExcelDto> dtoList = attendances.stream()
                .map(a -> AttendanceExcelDto.builder()
                        .name(defaultIfEmpty(a.getUser().getName()))
                        .nickName(defaultIfEmpty(a.getUser().getNickname()))
                        .departmentName(defaultIfEmpty(a.getUser().getDepartment().getDepartmentName()))
                        .date(a.getDate().toString())
                        .checkIn(formatTime(a.getCheckInTime()))
                        .checkOut(formatTime(a.getCheckOutTime()))
                        .attendanceStatus(a.getAttendanceStatus().getDisplayName())
                        .leaveReason(a.getLeaveType() != null ? a.getLeaveType().getDisplayName() : "-")
                        .build())
                .toList();

        return generateStyledAttendanceExcel(dtoList, startDate, endDate);
    }

    // 엑셀 생성 전용 메서드
    private byte[] generateStyledAttendanceExcel(List<AttendanceExcelDto> dtoList, LocalDate start, LocalDate end) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        CellStyle defaultStyle = createDefaultCellStyle(workbook);
        Sheet sheet = workbook.createSheet("근태기록");

        // 제목 행
        Row titleRow = sheet.createRow(0);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 7));
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("근태 기간: " + start + " ~ " + end);
        titleCell.setCellStyle(createTitleStyle(workbook));

        // 헤더
        String[] headers = {"이름", "닉네임", "부서", "날짜", "출근 시간", "퇴근 시간", "상태", "비고"};
        Row headerRow = sheet.createRow(1);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(createHeaderStyle(workbook));
        }

        // 데이터
        int rowIdx = 2;
        for (AttendanceExcelDto dto : dtoList) {
            Row row = sheet.createRow(rowIdx++);

            Cell nameCell = row.createCell(0);
            nameCell.setCellValue(dto.getName());
            nameCell.setCellStyle(defaultStyle);

            row.createCell(1).setCellValue(dto.getNickName());
            row.getCell(1).setCellStyle(defaultStyle);

            row.createCell(2).setCellValue(dto.getDepartmentName());
            row.getCell(2).setCellStyle(defaultStyle);

            row.createCell(3).setCellValue(dto.getDate());
            row.getCell(3).setCellStyle(defaultStyle);

            row.createCell(4).setCellValue(dto.getCheckIn());
            row.getCell(4).setCellStyle(defaultStyle);

            row.createCell(5).setCellValue(dto.getCheckOut());
            row.getCell(5).setCellStyle(defaultStyle);

            Cell statusCell = row.createCell(6);
            statusCell.setCellValue(createStatusRichText(dto.getAttendanceStatus(), workbook));
            statusCell.setCellStyle(defaultStyle);

            Cell reasonCell = row.createCell(7);
            reasonCell.setCellValue(dto.getLeaveReason());
            reasonCell.setCellStyle(defaultStyle); // 기존 wrapStyle 제거하고 defaultStyle 사용
        }

        // 데이터 사이 간격
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1024);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();
        return out.toByteArray();
    }

    // 헤더 스타일
    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.BLACK.getIndex());
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    // 공통 셀 스타일
    private CellStyle createDefaultCellStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    // 상태 스타일
    private RichTextString createStatusRichText(String status, Workbook workbook) {
        String dot = "●";
        String text = " " + status;

        Font coloredDotFont = workbook.createFont();
        coloredDotFont.setColor(switch (status) {
            case "지각" -> IndexedColors.RED.getIndex();
            case "연차" -> IndexedColors.BLUE.getIndex();
            case "결근" -> IndexedColors.DARK_RED.getIndex();
            case "정상 출근" -> IndexedColors.GREEN.getIndex();
            case "조퇴" -> IndexedColors.ORANGE.getIndex();
            case "출장" -> IndexedColors.VIOLET.getIndex();
            case "특별 휴가" -> IndexedColors.INDIGO.getIndex();
            default -> IndexedColors.GREY_50_PERCENT.getIndex();
        });

        Font defaultFont = workbook.createFont();
        defaultFont.setColor(IndexedColors.BLACK.getIndex());

        // Rich text 구성
        RichTextString richText = new XSSFRichTextString(dot + text);
        richText.applyFont(0, 1, coloredDotFont);                 // ●만 컬러
        richText.applyFont(1, richText.length(), defaultFont);   // 나머지는 검정색

        return richText;
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    // 빈 문자열 포맷
    private String defaultIfEmpty(String value) {
        return (value == null || value.trim().isEmpty()) ? "-" : value;
    }

    // 시간 포맷
    private String formatTime(LocalDateTime time) {
        return time != null ? time.format(DateTimeFormatter.ofPattern("HH:mm:ss")) : "-";
    }
}
