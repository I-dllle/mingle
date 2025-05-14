package com.example.mingle.global.aws;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Component
public class AwsS3Uploader {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    // MultipartFile을 S3에 업로드
    public String upload(MultipartFile multipartFile, String dirName) throws IOException {
        File uploadFile = convert(multipartFile)
                .orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File 전환 실패"));

        String ext = getFileExtension(uploadFile.getName());
        String uuid = UUID.randomUUID().toString();
        String fileName = dirName + "/" + uuid + ext;

        // S3 업로드
        putS3(uploadFile, fileName);

        // 로컬 파일 삭제
        removeNewFile(uploadFile);

        // S3 파일 URL 반환
        return generateS3Url(fileName);
    }

    private void putS3(File uploadFile, String fileName) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(fileName)
                .acl("public-read") // PublicRead 권한 부여
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromFile(uploadFile));
    }

    private String generateS3Url(String fileName) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, fileName);
    }

    private void removeNewFile(File targetFile) {
        if (targetFile.delete()) {
            log.info("로컬 파일 삭제 성공: {}", targetFile.getName());
        } else {
            log.warn("로컬 파일 삭제 실패: {}", targetFile.getName());
        }
    }

    private Optional<File> convert(MultipartFile file) throws IOException {
        File convertFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        if (convertFile.createNewFile()) {
            try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                fos.write(file.getBytes());
            }
            return Optional.of(convertFile);
        }
        return Optional.empty();
    }

    private String getFileExtension(String fileName) {
        int index = fileName.lastIndexOf(".");
        return index != -1 ? fileName.substring(index) : "";
    }
}