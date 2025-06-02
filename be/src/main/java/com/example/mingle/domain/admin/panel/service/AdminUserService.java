package com.example.mingle.domain.admin.panel.service;

import com.example.mingle.domain.admin.panel.dto.AdminRequestUser;
import com.example.mingle.domain.admin.panel.dto.AdminUpdateUser;
import com.example.mingle.domain.admin.panel.dto.UserSearchDto;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.dto.UserSimpleDto;
import com.example.mingle.domain.user.user.entity.*;
import com.example.mingle.domain.user.user.repository.UserPositionRepository;
import com.example.mingle.domain.user.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final UserPositionRepository userPositionRepository;

    @Transactional(readOnly = true)
    public Page<AdminRequestUser> getUsersFiltered(Long departmentId, PositionCode positionCode, Pageable pageable) {
        return userRepository.findByDepartmentAndPositionCode(departmentId, positionCode, pageable)
                .map(AdminRequestUser::from);
    }


    public AdminRequestUser getUser(Long id) {
        return userRepository.findByIdWithRelations(id)
                .map(AdminRequestUser::from)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Transactional
    public void updateUser(Long id, AdminUpdateUser req) {
        User user = userRepository.findById(id).orElseThrow();

        user.setName(req.name());
        user.setPhoneNum(req.phoneNum());

        if (req.departmentId() != null) {
            Department dept = departmentRepository.findById(req.departmentId()).orElseThrow();
            user.setDepartment(dept);
        }

        if (req.positionId() != null) {
            UserPosition position = userPositionRepository.findById(req.positionId()).orElseThrow();
            user.setPosition(position);
        }

        userRepository.save(user);  // save는 merge 동작
    }

    public void updateRole(Long id, UserRole role) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(role);
        userRepository.save(user);
    }

    public void updateStatus(Long id, UserStatus status) {
        User user = userRepository.findById(id).orElseThrow();
        user.setStatus(status);
        userRepository.save(user);
    }

    public List<UserSearchDto> searchByName(String name) {
        List<User> users = userRepository.findByNicknameContainingIgnoreCase(name);
        return users.stream()
                .map(UserSearchDto::from)
                .toList();
    }
}