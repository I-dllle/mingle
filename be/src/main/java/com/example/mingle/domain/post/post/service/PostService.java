package com.example.mingle.domain.post.post.service;

import com.example.mingle.domain.post.post.dto.PostRequestDto;
import com.example.mingle.domain.post.post.dto.PostResponseDto;
import com.example.mingle.domain.post.post.entity.BusinessDocumentCategory;
import com.example.mingle.domain.post.post.entity.NoticeType;
import com.example.mingle.domain.post.post.entity.Post;
import com.example.mingle.domain.post.post.entity.PostMenu;
import com.example.mingle.domain.post.post.repository.MenuRepository;
import com.example.mingle.domain.post.post.repository.PostRepository;
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

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final AwsS3Uploader awsS3Uploader;
    private final MenuRepository menuRepository;

    //TODO : 글쓰기 권한 체크 (사용자 인증/인가 필요)

    //게시글 CREATE
    @Transactional
    public PostResponseDto createPost(Long postMenuId, Long userId, PostRequestDto requestDto, MultipartFile[] postImage)
            throws IOException, java.io.IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(USER_NOT_FOUND));
        PostMenu menu = menuRepository.findById(postMenuId).
                orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));
        Department department = user.getDepartment();

        // 이 글이 '공지사항'이라면 -> 작성 권한 체크
        if (menu.getName().equals("공지사항")) {
            if (requestDto.getNoticeType() == NoticeType.GENERAL_NOTICE && user.getRole() != UserRole.ADMIN) {
                throw new ApiException(ErrorCode.ACCESS_DENIED);
            }

            if (requestDto.getNoticeType() == NoticeType.DEPARTMENT_NOTICE &&
                    !user.getDepartment().equals(menu.getDepartment())) {
                throw new ApiException(ErrorCode.ACCESS_DENIED);
            }

            if (requestDto.getNoticeType() == NoticeType.COMPANY_NEWS && user.getRole() != UserRole.ADMIN) {
                throw new ApiException(ErrorCode.ACCESS_DENIED);

            }
        }

        //사용자가 소속된 부서에만 글을 작성할 수 있도록 권한 제한
        if (!menu.getName().equals("공지사항")) {
            if (!user.getDepartment().equals(menu.getDepartment())) {
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
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .category(requestDto.getBusinessDocumentCategory())
                .menu(menu)
                .user(user)
                .department(department)
                .imageUrl(uploadedUrls)
                .isDeleted(false)
                .build();
        postRepository.save(post);
        return PostResponseDto.fromEntity(post);
    }

    //게시글 READ
    // 전체 공지사항 조회 (isGlobalNotice == true)
    public List<PostResponseDto> getGlobalNotices(){
        PostMenu menu = menuRepository.findByCode("BUSINESS_DOCUMENTS")
                .orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));

        return postRepository.findByMenuAndCategory(menu, BusinessDocumentCategory.RESOURCE).stream()
                .filter(post -> !post.isDeleted())
                .filter(post -> post.getDepartment() == null) // 부서 없으면 전체공지로 간주
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 부서별 공지사항 조회 (postType.name == '공지사항' && isGlobalNotice == false)
    public List<PostResponseDto> getDepartmentNotices(Long departmentId){
        return postRepository.findByDepartment_IdOrderByCreatedAtDesc(departmentId).stream()
                .filter(post -> !post.isDeleted())
                .filter(post -> post.getCategory() == BusinessDocumentCategory.RESOURCE) // 또는 MEETING_MINUTES 등 분기
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 공통 게시판 게시글 조회 (공통게시판 : 공지사항, 업무자료, )
    public List<PostResponseDto> getCommonPosts(Long postMenuId, String category){
        PostMenu menu = menuRepository.findById(postMenuId)
                .orElseThrow(() -> new ApiException(ErrorCode.POST_MENU_NOT_FOUND));

        if (category != null) {
            BusinessDocumentCategory categoryEnum = BusinessDocumentCategory.valueOf(category);
            return postRepository.findByMenuAndCategory(menu, categoryEnum).stream()
                    .filter(post -> !post.isDeleted())
                    .map(PostResponseDto::fromEntity)
                    .collect(Collectors.toList());
        }

        return postRepository.findByMenuAndIsDeletedFalse(menu).stream()
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
