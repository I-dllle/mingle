package com.example.mingle.domain.attendance.service;

import com.example.mingle.domain.attendance.repository.AttendanceRepository;
import com.example.mingle.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

}
