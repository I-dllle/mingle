package com.example.mingle.global.aws;

// SDK v2 import
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Component
@Service
public class AwsS3Uploader {

    // v2 전용 S3Client
    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * [SDK v1 방식] : MultipartFile → File (임시 파일로 변환) → S3 업로드 (PutObjectRequest)
     * → 업로드 후 로컬 파일 삭제
     *
     * [SDK v2 방식] : MultipartFile → byte[] 변환 : 파일 변환 없이!!
     * → byte[] → 바로 S3 업로드 (메모리 내 처리)
     */
    public String upload(MultipartFile multipartFile, String dirName) throws IOException {
        String ext = getFileExtension(multipartFile.getOriginalFilename());
        String uuid = UUID.randomUUID().toString(); //UUID를 적용하여 같은 이미지파일이어도 고유한 이름을 부여하여 전송
        String fileName = dirName + "/" + uuid + ext;

        // PutObjectRequest는 builder로 구성
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(fileName)
                .build();

        // 실제 업로드 실행
        s3Client.putObject(request, RequestBody.fromBytes(multipartFile.getBytes()));

        // 업로드 URL 반환 (v2 utility 사용)
        return s3Client.utilities()
                .getUrl(builder -> builder.bucket(bucket).key(fileName))
                .toString();
    }

    private String getFileExtension(String fileName) {
        int index = fileName.lastIndexOf(".");
        return index != -1 ? fileName.substring(index) : "";  // 예: ".jpg"
    }


/**
 * "파일로 변환해서 S3에 올린다"는 구버전 로직
 * multipartFile.getBytes()만으로 바로 업로드되니까 전부 불필요
  */
//    private String putS3(File uploadFile, String fileName) {
//        amazonS3.putObject(
//                new PutObjectRequest(bucket, fileName, uploadFile)
//                        .withCannedAcl(CannedAccessControlList.PublicRead)	// PublicRead 권한으로 업로드 됨
//        );
//        return amazonS3.getUrl(bucket, fileName).toString();
//    }
//
//    private void removeNewFile(File targetFile) {
//        if(targetFile.delete()) {
//            log.info("파일이 삭제되었습니다.");
//        }else {
//            log.info("파일이 삭제되지 못했습니다.");
//        }
//    }
//
//    private Optional<File> convert(MultipartFile file) throws IOException {
//        File convertFile = new File(file.getOriginalFilename());
//        if(convertFile.createNewFile()) {
//            try (FileOutputStream fos = new FileOutputStream(convertFile)) {
//                fos.write(file.getBytes());
//            }
//            return Optional.of(convertFile);
//        }
//        return Optional.empty();
//    }

}