"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminUserService } from "@/features/admin/services/adminUserService";
import {
  AdminRequestUser,
  AdminUpdateUser,
  AdminRoleUpdate,
  UserRole,
  UserStatus,
} from "@/features/admin/types/AdminUser";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.userId);

  const [user, setUser] = useState<AdminRequestUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    if (userId) {
      loadUser();
    }
  }, [userId]);
  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await adminUserService.getUser(userId);
      setUser(userData);
      setEditUserData({
        name: userData.name || "",
        phoneNum: userData.phoneNum || "",
        departmentId: 0, // 부서 ID는 별도로 관리 필요
        positionId: 0, // 포지션 ID는 별도로 관리 필요
      });
      setEditRoleData({ role: userData.role || UserRole.ARTIST });
    } catch (err) {
      setError("유저 정보를 불러오는 중 오류가 발생했습니다.");
      console.error("Get user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await adminUserService.updateUser(user.id, editUserData);
      setEditMode(null);
      loadUser(); // 정보 새로고침
    } catch (err) {
      setError("유저 정보 수정 중 오류가 발생했습니다.");
      console.error("Update user error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateRole = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await adminUserService.updateRole(user.id, editRoleData);
      setEditMode(null);
      loadUser(); // 정보 새로고침
    } catch (err) {
      setError("유저 권한 수정 중 오류가 발생했습니다.");
      console.error("Update role error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const newStatus =
        user.status === UserStatus.ACTIVE
          ? UserStatus.INACTIVE
          : UserStatus.ACTIVE;
      await adminUserService.updateStatus(user.id, { status: newStatus });
      loadUser(); // 정보 새로고침
    } catch (err) {
      setError("계정 상태 변경 중 오류가 발생했습니다.");
      console.error("Update status error:", err);
    } finally {
      setLoading(false);
    }
  };
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200";
      case UserRole.MANAGER:
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200";
      case UserRole.STAFF:
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200";
      case UserRole.ARTIST:
        return "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200";
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-200";
      case UserStatus.INACTIVE:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200";
    }
  };
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
              <svg
                className="w-8 h-8 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-900 to-purple-900 bg-clip-text text-transparent mb-2">
            사용자 정보를 불러오는 중...
          </h2>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-4">
            사용자를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            요청하신 사용자 정보가 존재하지 않습니다.
          </p>
          <button
            onClick={() => router.push("/panel/users")}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            사용자 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push("/panel/users")}
                className="flex items-center text-violet-600 hover:text-violet-800 mb-6 transition-all duration-200 group"
              >
                <div className="mr-2 p-1 rounded-md group-hover:bg-violet-100 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                유저 목록으로 돌아가기
              </button>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-900 to-purple-900 bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    @{user.nickname} • ID #{user.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(
                    user.role
                  )}`}
                >
                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                  {user.role}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    user.status
                  )}`}
                >
                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                  {user.status}
                </span>
              </div>{" "}
            </div>
          </div>
        </div>{" "}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-900 to-purple-900 bg-clip-text text-transparent">
                  사용자 정보
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">실시간 동기화</span>
                </div>{" "}
              </div>

              {editMode === "info" ? (
                /* Edit Info Form */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {" "}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        이름
                      </label>
                      <input
                        type="text"
                        value={editUserData.name || ""}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                        placeholder="사용자 이름을 입력하세요"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        전화번호
                      </label>
                      <input
                        type="text"
                        value={editUserData.phoneNum || ""}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            phoneNum: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                        placeholder="010-0000-0000"
                      />
                    </div>{" "}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        부서 ID
                      </label>
                      <input
                        type="number"
                        value={editUserData.departmentId || 0}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            departmentId: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                        placeholder="부서 ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        포지션 ID
                      </label>
                      <input
                        type="number"
                        value={editUserData.positionId || 0}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            positionId: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                        placeholder="포지션 ID"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setEditMode(null)}
                      className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleUpdateUser}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          저장 중...
                        </div>
                      ) : (
                        "변경사항 저장"
                      )}
                    </button>
                  </div>
                </div>
              ) : editMode === "role" ? (
                /* Edit Role Form */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        권한 수준
                      </label>
                      <select
                        value={editRoleData.role}
                        onChange={(e) =>
                          setEditRoleData({ role: e.target.value as UserRole })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                      >
                        {Object.values(UserRole).map((role) => (
                          <option key={role} value={role}>
                            {role === UserRole.ADMIN && "관리자"}
                            {role === UserRole.MANAGER && "매니저"}
                            {role === UserRole.STAFF && "직원"}
                            {role === UserRole.ARTIST && "아티스트"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                        <div className="flex items-start">
                          <svg
                            className="w-4 h-4 mt-0.5 mr-2 text-amber-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          <div>
                            <p className="font-medium">권한 변경 주의사항</p>
                            <p className="mt-1 text-xs">
                              권한 변경은 즉시 적용되며, 사용자의 접근 권한이
                              변경됩니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setEditMode(null)}
                      className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleUpdateRole}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          권한 변경 중...
                        </div>
                      ) : (
                        "권한 변경"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-900">
                        기본 정보
                      </h3>
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">
                          이름
                        </span>
                        <span className="text-blue-900 font-semibold">
                          {user.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">
                          닉네임
                        </span>
                        <span className="text-blue-900 font-semibold">
                          @{user.nickname}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">
                          이메일
                        </span>
                        <span className="text-blue-900 font-mono text-sm">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">
                          전화번호
                        </span>
                        <span className="text-blue-900 font-mono text-sm">
                          {user.phoneNum}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-emerald-900">
                        조직 정보
                      </h3>
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-emerald-700">
                          부서
                        </span>
                        <span className="text-emerald-900 font-semibold">
                          {user.departmentName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-emerald-700">
                          포지션
                        </span>
                        <span className="text-emerald-900 font-semibold">
                          {user.Name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-emerald-700">
                          사용자 ID
                        </span>
                        <span className="text-emerald-900 font-mono font-semibold">
                          #{user.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-purple-900">
                        권한 & 상태
                      </h3>
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-700">
                          권한
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                          {user.role}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-700">
                          계정 상태
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            user.status
                          )}`}
                        >
                          <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status & Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-900 to-purple-900 bg-clip-text text-transparent mb-6">
                빠른 작업
              </h3>{" "}
              <div className="space-y-3">
                <button
                  onClick={handleStatusToggle}
                  disabled={loading}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group ${
                    user.status === UserStatus.ACTIVE
                      ? "bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-amber-200"
                      : "bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        user.status === UserStatus.ACTIVE
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {user.status === UserStatus.ACTIVE ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.586l4.707-4.707C10.923 2.663 11.596 2 12.414 2h.172a2 2 0 012 2v4.586l4.707 4.707A1 1 0 0119 14h-4v4a2 2 0 01-2 2z"
                          />
                        )}
                      </svg>
                    </div>
                    <div className="text-left">
                      <p
                        className={`font-semibold ${
                          user.status === UserStatus.ACTIVE
                            ? "text-amber-900"
                            : "text-green-900"
                        }`}
                      >
                        {user.status === UserStatus.ACTIVE
                          ? "계정 비활성화"
                          : "계정 활성화"}
                      </p>
                      <p
                        className={`text-xs ${
                          user.status === UserStatus.ACTIVE
                            ? "text-amber-700"
                            : "text-green-700"
                        }`}
                      >
                        {user.status === UserStatus.ACTIVE
                          ? "계정을 일시 정지합니다"
                          : "계정을 다시 활성화합니다"}
                      </p>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                      user.status === UserStatus.ACTIVE
                        ? "text-amber-600"
                        : "text-green-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>{" "}
                <button
                  onClick={() =>
                    setEditMode(editMode === "info" ? null : "info")
                  }
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl border border-purple-200 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-purple-900">
                        {editMode === "info" ? "취소" : "정보 수정"}
                      </p>
                      <p className="text-xs text-purple-700">
                        사용자 정보 편집
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>{" "}
                <button
                  onClick={() =>
                    setEditMode(editMode === "role" ? null : "role")
                  }
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-blue-900">
                        {editMode === "role" ? "취소" : "권한 변경"}
                      </p>
                      <p className="text-xs text-blue-700">사용자 권한 관리</p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
