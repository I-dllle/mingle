"use client";

import React, { useState, useEffect } from "react";
import { adminUserService } from "@/features/admin/services/adminUserService";
import {
  AdminRequestUser,
  AdminUpdateUser,
  AdminRoleUpdate,
  UserRole,
  UserStatus,
  PositionCode,
} from "@/features/admin/types/AdminUser";
import { UserSearchDto } from "@/features/department/finance-legal/contracts/types/Contract";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PageResponse<AdminRequestUser>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 20,
    number: 0,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 필터링 상태
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [positionCode, setPositionCode] = useState<PositionCode | undefined>();
  const [currentPage, setCurrentPage] = useState(0);

  // 검색 상태
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchDto[]>([]);

  // 선택된 유저 및 편집 모드
  const [selectedUser, setSelectedUser] = useState<AdminRequestUser | null>(
    null
  );
  const [editMode, setEditMode] = useState<"info" | "role" | null>(null);

  // 편집 폼 데이터
  const [editUserData, setEditUserData] = useState<AdminUpdateUser>({
    name: "",
    phoneNum: "",
    departmentId: 0,
    positionId: 0,
  });
  const [editRoleData, setEditRoleData] = useState<AdminRoleUpdate>({
    role: UserRole.ARTIST,
  });

  useEffect(() => {
    loadUsers();
  }, [departmentId, positionCode, currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminUserService.getUsersFiltered(
        departmentId,
        positionCode,
        currentPage,
        20
      );
      setUsers(response);
    } catch (err) {
      setError("유저 목록을 불러오는 중 오류가 발생했습니다.");
      console.error("Load users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) return;

    try {
      setLoading(true);
      const results = await adminUserService.searchByName(searchName);
      setSearchResults(results);
    } catch (err) {
      setError("유저 검색 중 오류가 발생했습니다.");
      console.error("Search users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (userId: number) => {
    try {
      setLoading(true);
      const user = await adminUserService.getUser(userId);
      setSelectedUser(user);
      setEditUserData({
        name: user.name,
        phoneNum: user.phoneNum,
        departmentId: 0, // 부서 ID는 별도로 관리 필요
        positionId: 0, // 포지션 ID는 별도로 관리 필요
      });
      setEditRoleData({ role: user.role });
    } catch (err) {
      setError("유저 정보를 불러오는 중 오류가 발생했습니다.");
      console.error("Get user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      await adminUserService.updateUser(selectedUser.id, editUserData);
      setEditMode(null);
      loadUsers(); // 목록 새로고침
      setSelectedUser(null);
    } catch (err) {
      setError("유저 정보 수정 중 오류가 발생했습니다.");
      console.error("Update user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      await adminUserService.updateRole(selectedUser.id, editRoleData);
      setEditMode(null);
      loadUsers(); // 목록 새로고침
      setSelectedUser(null);
    } catch (err) {
      setError("유저 권한 수정 중 오류가 발생했습니다.");
      console.error("Update role error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-red-100 text-red-800";
      case UserRole.MANAGER:
        return "bg-purple-100 text-purple-800";
      case UserRole.STAFF:
        return "bg-blue-100 text-blue-800";
      case UserRole.ARTIST:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case UserStatus.INACTIVE:
        return "bg-gray-100 text-gray-800";
      case UserStatus.BANNED:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">유저 관리</h1>
          <p className="text-gray-600 mt-2">
            시스템 사용자를 관리하고 권한을 설정하세요
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                부서 ID
              </label>
              <input
                type="number"
                value={departmentId || ""}
                onChange={(e) =>
                  setDepartmentId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="부서 ID 입력"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                포지션
              </label>
              <select
                value={positionCode || ""}
                onChange={(e) =>
                  setPositionCode((e.target.value as PositionCode) || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {Object.values(PositionCode).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 검색
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이름으로 검색"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading || !searchName.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              >
                검색
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              검색 결과
            </h3>
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div>
                    <span className="font-medium text-gray-900">
                      {user.name}
                    </span>
                    <span className="text-gray-600 ml-2">({user.id})</span>
                  </div>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              유저 목록 ({users.totalElements}명)
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용자 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      부서/포지션
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      권한
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.content.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name} ({user.nickname})
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phoneNum}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.departmentName}
                        </div>
                        <div className="text-sm text-gray-500">{user.Name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleUserSelect(user.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {users.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  페이지 {users.number + 1} / {users.totalPages}
                </div>
                <div className="flex space-x-2">
                  {" "}
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={users.first}
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
                  >
                    이전
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(users.totalPages - 1, currentPage + 1)
                      )
                    }
                    disabled={users.last}
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
                  >
                    다음
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  유저 상세 정보
                </h3>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setEditMode(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이름
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      닉네임
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.nickname}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이메일
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      전화번호
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.phoneNum}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      부서
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.departmentName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      포지션
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.Name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      권한
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                        selectedUser.role
                      )}`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      상태
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedUser.status
                      )}`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setEditMode("info")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  정보 수정
                </button>
                <button
                  onClick={() => setEditMode("role")}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  권한 수정
                </button>
              </div>

              {/* Edit Forms */}
              {editMode === "info" && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    정보 수정
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이름
                      </label>
                      <input
                        type="text"
                        value={editUserData.name}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        전화번호
                      </label>
                      <input
                        type="text"
                        value={editUserData.phoneNum}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            phoneNum: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        부서 ID
                      </label>
                      <input
                        type="number"
                        value={editUserData.departmentId}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            departmentId: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        포지션 ID
                      </label>
                      <input
                        type="number"
                        value={editUserData.positionId}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            positionId: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleUpdateUser}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              {editMode === "role" && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    권한 수정
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      권한
                    </label>
                    <select
                      value={editRoleData.role}
                      onChange={(e) =>
                        setEditRoleData({ role: e.target.value as UserRole })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(UserRole).map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleUpdateRole}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
