package com.example.mingle.domain.post.post.repository;

import com.example.mingle.domain.post.post.entity.NoticeType;
import com.example.mingle.domain.post.post.entity.Post;
import com.example.mingle.domain.post.post.entity.BusinessDocumentCategory;
import com.example.mingle.domain.post.post.entity.PostMenu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    //부서와 게시글 제목으로 찾기
    //DB검색의 효율성을 고려하여 제목String만으로 찾지 않고 부서정보와 함께 검색한다
    List<Post> findByDepartment_IdAndTitle(Long deptId, String title);

    //부서별 게시글 목록(부서id로 검색)
    List<Post> findByDepartment_IdOrderByCreatedAtDesc(Long deptId);

    //메뉴타입과 카테고리로 게시글 조회(카테고리 분기가 있는 메뉴 - 업무자료)
    List<Post> findByMenuAndCategory(PostMenu postMenu, BusinessDocumentCategory businessDocumentCategory);

    //공지사항 찾기
    @Query("""
    SELECT p FROM Post p
    LEFT JOIN FETCH p.imageUrl
    WHERE p.menu = :menu AND p.noticeType = :noticeType AND p.isDeleted = false
""")
    List<Post> findWithImageUrlByMenuAndNoticeType(
            @Param("menu") PostMenu menu,
            @Param("noticeType") NoticeType noticeType
    );


    //소프트 삭제(isDeleted)
    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.imageUrl WHERE p.menu = :menu AND p.isDeleted = false")
    List<Post> findAllByMenuWithImageUrl(@Param("menu") PostMenu menu);

    //메뉴타입으로 게시글 찾기
    List<Post> findByMenu(PostMenu menu);

    //페이징 처리
    Page<Post> findByMenu_Id(Long menuId, Pageable pageable);
    Page<Post> findAll(Pageable pageable);

    List<Post> findByCreatedAtAfterAndNoticeTypeInOrderByCreatedAtDesc(LocalDateTime time, List<NoticeType> noticeTypes);

    @Query("""
    SELECT p FROM Post p
    LEFT JOIN FETCH p.imageUrl
    WHERE p.id = :postId AND p.isDeleted = false
""")
    Optional<Post> findWithImageUrlById(@Param("postId") Long postId);


    @Query("""
    SELECT DISTINCT p FROM Post p
    LEFT JOIN FETCH p.imageUrl
    WHERE p.department.id = :depId
      AND p.category = :category
      AND p.isDeleted = false
""")
    List<Post> findWithImageUrlByDepartmentIdAndCategory(
            @Param("depId") Long depId,
            @Param("category") BusinessDocumentCategory category
    );

}
