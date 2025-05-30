package com.example.mingle.global.aws;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/s3")
public class AmazonS3Controller {
    private final AwsS3Uploader awsS3Uploader;

    @PostMapping("/upload/chat")
    public ResponseEntity<String> uploadChatImage(@RequestParam("file") MultipartFile multipartFile) {
        return uploadWithFolder(multipartFile, "chat_images");
    }
    @PostMapping("/upload/post")
    public ResponseEntity<String> uploadPostImage(@RequestParam("file") MultipartFile multipartFile) {
        return uploadWithFolder(multipartFile, "post_images");
    }
    @PostMapping("/upload/profile")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile multipartFile) {
        return uploadWithFolder(multipartFile, "profile_images");
    }
    @PostMapping("/upload/goods")
    public ResponseEntity<String> uploadGoodsImage(@RequestParam("file") MultipartFile multipartFile) {
        return uploadWithFolder(multipartFile, "goods_images");
    }

    private ResponseEntity<String> uploadWithFolder(MultipartFile file, String folder) {
        try {
            String uploadedUrl = awsS3Uploader.upload(file, folder);
            return ResponseEntity.ok(uploadedUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("이미지 업로드 실패: " + e.getMessage());
        }
    }

}
