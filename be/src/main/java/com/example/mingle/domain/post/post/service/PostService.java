package com.example.mingle.domain.post.post.service;

import com.example.mingle.domain.post.post.dto.PostRequestDto;
import com.example.mingle.domain.post.post.dto.PostResponseDto;
import com.example.mingle.domain.post.post.entity.BusinessDocumentCategory;
import com.example.mingle.domain.post.post.entity.NoticeType;
import com.example.mingle.domain.post.post.entity.Post;
import com.example.mingle.domain.post.post.entity.PostMenu;
import com.example.mingle.domain.post.post.entity.PostType;
import com.example.mingle.domain.post.post.repository.MenuRepository;
import com.example.mingle.domain.post.post.repository.PostRepository;
import com.example.mingle.domain.post.post.repository.PostTypeRepository;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.domain.user.user.service.UserService;
import com.example.mingle.global.aws.AwsS3Uploader;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

import static com.example.mingle.global.exception.ErrorCode.USER_NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final AwsS3Uploader awsS3Uploader;
    private final MenuRepository menuRepository;
    private final PostTypeRepository postTypeRepository;

    //게시글 CREATE
    @Transactional
    public PostResponseDto createPost(Long postTypeId, Long userId, PostRequestDto requestDto, MultipartFile[] postImage)
            throws IOException, java.io.IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(USER_NOT_FOUND));
        
        PostType postType = postTypeRepository.findById(postTypeId)
                .orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));
        PostMenu menu = postType.getMenu();
        Department department = user.getDepartment();

        // 이 글이 '공지사항'이라면 -> 작성 권한 체크
        if (menu.getName().equals("공지사항")) {
            if (requestDto.getNoticeType() == NoticeType.GENERAL_NOTICE && user.getRole() != UserRole.ADMIN) {
                throw new ApiException(ErrorCode.ACCESS_DENIED);
            }
            //부서별 공지사항은 해당 부서 사람만 작성가능
            if (requestDto.getNoticeType() == NoticeType.DEPARTMENT_NOTICE &&
                    !user.getDepartment().equals(postType.getDepartment())) {
                throw new ApiException(ErrorCode.ACCESS_DENIED);
            }
            if (requestDto.getNoticeType() == NoticeType.COMPANY_NEWS && user.getRole() != UserRole.ADMIN) {
                throw new ApiException(ErrorCode.ACCESS_DENIED);
            }
        }

        //사용자가 소속된 부서에만 글을 작성할 수 있도록 권한 제한
        if (!menu.getName().equals("공지사항")) {
            if (!user.getDepartment().equals(postType.getDepartment())) {
                log.error("Access denied: User department doesn't match postType department");
                log.error("User Department: {}", user.getDepartment().getDepartmentName());
                log.error("PostType Department: {}", postType.getDepartment().getDepartmentName());
                throw new ApiException(ErrorCode.ACCESS_DENIED);
            }
        }


        String[] uploadedUrls = null;
        if (postImage != null && postImage.length > 0) {
            uploadedUrls = new String[postImage.length];
            for (int i = 0; i < postImage.length; i++) {
                MultipartFile image = postImage[i];
                if (image != null && !image.isEmpty()) {
                    uploadedUrls[i] = awsS3Uploader.upload(image, "post_images");
                } else {
                    uploadedUrls[i] = null; // 이미지가 없으면 null로 처리
                }
            }
        }

        Post post = Post.builder()
                .department(department)
                .menu(menu)
                .postType(postType)
                .category(requestDto.getBusinessDocumentCategory())
                .user(user)
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .imageUrl(uploadedUrls)
                .isDeleted(false)
                .noticeType(requestDto.getNoticeType())
                .build();
        postRepository.save(post);
        return PostResponseDto.fromEntity(post);
    }

    //게시글 READ
    // 전체 공지사항 조회
    public List<PostResponseDto> getGlobalNotices(){
        PostMenu menu = menuRepository.findByCode("NOTICE")
                .orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));

        return postRepository.findByMenuAndNoticeType(menu, NoticeType.GENERAL_NOTICE).stream()
                .filter(post -> !post.isDeleted())
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 부서별 공지사항 조회
    public List<PostResponseDto> getDepartmentNotices(Long departmentId){
        PostMenu menu = menuRepository.findByCode("NOTICE")
                .orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));

        return postRepository.findByMenuAndNoticeType(menu, NoticeType.DEPARTMENT_NOTICE).stream()
                .filter(post -> !post.isDeleted())
                .filter(post -> post.getDepartment().getId() == departmentId)
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 회사소식 조회
    public List<PostResponseDto> getCompanyNews(){
        PostMenu menu = menuRepository.findByCode("NOTICE")
                .orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));

        return postRepository.findByMenuAndNoticeType(menu, NoticeType.COMPANY_NEWS).stream()
                .filter(post -> !post.isDeleted())
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PostResponseDto> getNoticesByType(NoticeType noticeType, Long departmentId) {
        if (noticeType == NoticeType.GENERAL_NOTICE) {
            return getGlobalNotices();
        }

        if (noticeType == NoticeType.DEPARTMENT_NOTICE) {
            if (departmentId == null) {
                throw new ApiException(ErrorCode.DEPARTMENT_NOT_FOUND);
            }
            return getDepartmentNotices(departmentId);
        }

        if (noticeType == NoticeType.COMPANY_NEWS) {
            return getCompanyNews();
        }

        throw new ApiException(ErrorCode.POST_NOT_FOUND);
    }

    // 업무자료 게시판 게시글 조회
    public List<PostResponseDto> getBusinessDocuments(Long postMenuId, BusinessDocumentCategory category){
        PostMenu menu = menuRepository.findById(postMenuId)
                .orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));

        return postRepository.findByMenuAndCategory(menu, category).stream()
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 부서별 게시판 게시글 조회
    public List<PostResponseDto> getPostsByMenu(Long deptId, Long postMenuId){
        PostMenu menu = menuRepository.findById(postMenuId)
                .orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));

        return postRepository.findByMenuAndIsDeletedFalse(menu).stream()
                .filter(post -> post.getDepartment().getId().equals(deptId))
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    //오디션 공고 게시글 조회
    public List<PostResponseDto> getAuditionPosts(Long postMenuId){
        PostMenu menu = menuRepository.findById(postMenuId)
                .orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));

        return postRepository.findByMenu(menu).stream()
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 게시글 상세보기
    @Transactional(readOnly = true)
    public PostResponseDto getPostById(Long postId){
        Post post = postRepository.findById(postId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ApiException(ErrorCode.POST_NOT_FOUND));
        return PostResponseDto.fromEntity(post);
    }

    //게시글 UPDATE
    @Transactional
    public PostResponseDto updatePost(Long postId, Long userId, PostRequestDto requestDto, MultipartFile[] postImage) throws IOException, java.io.IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ApiException(ErrorCode.POST_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(USER_NOT_FOUND));

        // 작성자 본인인지 확인
        if (!post.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }

        // 공지사항 수정 권한 체크
        if (post.getMenu().getName().equals("공지사항")) {
            // 공지사항인 경우 권한을 확인
            if (requestDto.getNoticeType() == NoticeType.GENERAL_NOTICE && user.getRole() != UserRole.ADMIN) {
                throw new ApiException(ErrorCode.ACCESS_DENIED);
            }

            if (requestDto.getNoticeType() == NoticeType.DEPARTMENT_NOTICE &&
                    !user.getDepartment().equals(post.getMenu().getDepartment())) {
                throw new ApiException(ErrorCode.ACCESS_DENIED);
            }
        }

        String[] uploadedUrls = null;
        if (postImage != null && postImage.length > 0) {
            uploadedUrls = new String[postImage.length];
            for (int i = 0; i < postImage.length; i++) {
                MultipartFile image = postImage[i];
                if (image != null && !image.isEmpty()) {
                    uploadedUrls[i] = awsS3Uploader.upload(image, "post_images");
                } else {
                    uploadedUrls[i] = null; // 이미지가 없으면 null로 처리
                }
            }
        } else {
            // 수정된 이미지가 없을 경우 기존 이미지를 그대로 사용
            uploadedUrls = post.getImageUrl();
        }

        post.update(
                requestDto.getTitle(),
                requestDto.getContent(),
                requestDto.getBusinessDocumentCategory(),
                uploadedUrls
        );
        return PostResponseDto.fromEntity(post);
    }

    //게시글 DELETE
    public void deletePost(Long postId, Long userId){
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ApiException(ErrorCode.POST_NOT_FOUND));

        // 이미 삭제된 게시글 예외 처리
        if (post.isDeleted()) {
            throw new ApiException(ErrorCode.ALREADY_DELETED_POST);
        }

        // 게시글 작성자만 삭제 가능
        if (!post.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }

        post.setDeleted(true); // 소프트 삭제
        postRepository.save(post);
        //postRepository.delete(post);
    }

    // 전체 게시글 페이징
    public Page<PostResponseDto> getAllPostsPageable(int page, int size, String sortField, Sort.Direction direction){
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return postRepository.findAll(pageable)
                .map(PostResponseDto::fromEntity);
    }
    // 특정 메뉴에 해당하는 게시글 페이징
    public Page<PostResponseDto> getPostsByPageable(Long postMenuId, int page, int size, String sortField, Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return postRepository.findByMenu_Id(postMenuId, pageable)
                .map(PostResponseDto::fromEntity);
    }

////TODO : 게시글 검색(페이징)
//    public Page<PostResponseDto> searchPostsPageable(String type, String keyword, int page, int size, String sortField, Sort.Direction direction){
//
//    }

}
