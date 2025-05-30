'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthProvider';
import { Role, DepartmentRole, ProjectRole } from '@/features/auth/types/roles';
import { ChatScope } from '@/features/chat/common/types/ChatScope';
import { RoomType } from '@/features/chat/common/types/RoomType';
import { createGroupChatRoom } from '@/features/chat/group/services/createGroupChatRoom';
import { getDepartments } from '@/features/user/team/services/getDepartments';
import { DepartmentResponse } from '@/features/user/team/types/department';

export default function GroupChatRoomCreatePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 폼 상태 정의
  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState<RoomType>(RoomType.NORMAL);
  const [scope, setScope] = useState<ChatScope | ''>('');
  const [teamId, setTeamId] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');

  // 부서 선택 드롭다운용 상태
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | ''>(
    ''
  );

  // 프로젝트 목록 상태
  const [projects, setProjects] = useState<
    { projectId: number; projectName: string }[]
  >([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');

  // 부서 목록 API 호출 (scope가 부서일 때만)
  useEffect(() => {
    if (scope === ChatScope.DEPARTMENT) {
      getDepartments()
        .then(setDepartments)
        .catch((err) => console.error('부서 목록 불러오기 실패:', err));
    }
  }, [scope]);

  // [자동 세팅] scope가 DEPARTMENT일 경우, 내 부서 ID로 teamId 설정
  useEffect(() => {
    if (selectedDepartmentId) {
      setTeamId(String(selectedDepartmentId));
    }
  }, [selectedDepartmentId]);

  // 프로젝트 스코프 선택 시 목록 불러오기
  useEffect(() => {
    if (scope === ChatScope.PROJECT) {
      fetch('/api/v1/projects')
        .then((res) => res.json())
        .then((data) => setProjects(data))
        .catch((err) => console.error('프로젝트 목록 불러오기 실패:', err));
    }
  }, [scope]);

  // 프로젝트 선택 시 teamId 자동 설정
  useEffect(() => {
    if (selectedProjectId) {
      setTeamId(String(selectedProjectId));
    }
  }, [selectedProjectId]);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !teamId || !scope) {
      alert('채팅방 이름과 팀 ID는 필수입니다.');
      return;
    }

    const formData = {
      name,
      roomType,
      scope,
      teamId: Number(teamId),
      projectEndDate: projectEndDate || null,
    };

    try {
      await createGroupChatRoom(formData); // 호출 연결
      alert('채팅방이 생성되었습니다!');
      router.push('/group'); // 생성 후 목록으로 이동
    } catch (err) {
      console.error('채팅방 생성 실패:', err);
      alert('채팅방 생성에 실패했습니다.');
    }
  };

  // 권한 여부 확인
  const isAuthorized =
    user?.role === Role.ADMIN ||
    user?.departmentRole === DepartmentRole.TEAM_LEAD ||
    user?.projectRole === ProjectRole.PROJECT_LEADER;

  useEffect(() => {
    if (!loading && !isAuthorized) {
      alert('접근 권한이 없습니다.');
      router.replace('/group'); // 권한 없을 시 목록 페이지로 이동
    }
  }, [loading, isAuthorized, router]);

  // [1] 로딩 중일 때는 로딩 표시
  if (loading) return <div>로딩 중...</div>;
  // [2] 권한이 없으면 리다이렉트 or 안내 메시지
  if (!isAuthorized) return null;

  // [3] 정상 접근 시 채팅방 생성 폼 출력
  return (
    <div style={{ padding: '24px' }}>
      <h2>그룹 채팅방 생성</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <label>
          채팅방 이름
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          방 타입
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value as RoomType)}
          >
            <option value={RoomType.NORMAL}>일반방</option>
            <option value={RoomType.ARCHIVE}>자료방</option>
          </select>
        </label>

        <label>
          소속
          <select
            value={scope}
            onChange={(e) => {
              setScope(e.target.value as ChatScope);
              setTeamId('');
              setSelectedDepartmentId('');
            }}
          >
            <option value="">선택</option> {/* ← 기본 선택값 */}
            <option value={ChatScope.DEPARTMENT}>부서</option>
            <option value={ChatScope.PROJECT}>프로젝트</option>
          </select>
        </label>

        {/* 부서 선택 시 부서 드롭다운 노출 */}
        {scope === ChatScope.DEPARTMENT && (
          <label>
            부서 선택
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
            >
              <option value="">부서를 선택해주세요</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* [추가] 프로젝트 선택 드롭다운 */}
        {scope === ChatScope.PROJECT && (
          <label>
            프로젝트 선택
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            >
              <option value="">프로젝트를 선택해주세요</option>
              {projects.map((proj) => (
                <option key={proj.projectId} value={proj.projectId}>
                  {proj.projectName}
                </option>
              ))}
            </select>
          </label>
        )}

        {scope === ChatScope.PROJECT && (
          <label>
            프로젝트 종료일 (선택)
            <input
              type="date"
              value={projectEndDate}
              onChange={(e) => setProjectEndDate(e.target.value)}
            />
          </label>
        )}

        <button type="submit" style={{ marginTop: '16px' }}>
          채팅방 생성
        </button>
      </form>
    </div>
  );
}
