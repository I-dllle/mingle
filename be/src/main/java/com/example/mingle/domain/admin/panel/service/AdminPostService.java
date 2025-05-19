//package com.example.mingle.domain.admin.panel.service;
//
//import com.example.mingle.domain.post.post.entity.Post;
//import com.example.mingle.global.exception.ApiException;
//import com.example.mingle.global.exception.ErrorCode;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class AdminPostService {
//
//    private final PostRepository postRepository;
//
//    // 게시글 작성
//    public Long createPost(CreatePostRequest request) {
//        Post post = Post.builder()
//                .title(request.getTitle())
//                .content(request.getContent())
//                .teamId(request.getTeamId())
//                .tag(request.getTag())
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        return postRepository.save(post).getId();
//    }
//
//    // 게시글 조회 (조건 필터)
//    public List<PostResponse> getPosts(Long teamId, String tag) {
//        List<Post> posts;
//
//        if (teamId != null && tag != null) {
//            posts = postRepository.findByTeamIdAndTag(teamId, tag);
//        } else if (teamId != null) {
//            posts = postRepository.findByTeamId(teamId);
//        } else if (tag != null) {
//            posts = postRepository.findByTag(tag);
//        } else {
//            posts = postRepository.findAll();
//        }
//
//        return posts.stream().map(PostResponse::from).toList();
//    }
//
//    // 게시글 수정
//    public void updatePost(Long id, UpdatePostRequest request) {
//        Post post = postRepository.findById(id)
//                .orElseThrow(() -> new ApiException(ErrorCode.POST_NOT_FOUND));
//
//        post.setTitle(request.getTitle());
//        post.setContent(request.getContent());
//        post.setTag(request.getTag());
//        post.setUpdatedAt(LocalDateTime.now());
//    }
//
//    // 게시글 삭제
//    public void deletePost(Long id) {
//        if (!postRepository.existsById(id)) {
//            throw new ApiException(ErrorCode.POST_NOT_FOUND);
//        }
//        postRepository.deleteById(id);
//    }
//}
