# 첫 번째 스테이지: 빌드 스테이지
FROM gradle:jdk-21-and-23-graal-jammy AS builder

# 작업 디렉토리 설정
WORKDIR /app

# Gradle Wrapper 및 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# 실행 권한 부여
RUN chmod +x gradlew

# 의존성 캐싱
RUN ./gradlew dependencies --no-daemon --info

# 소스 코드 복사
COPY src src

# 애플리케이션 빌드 (메모리 설정 추가)
RUN ./gradlew build --no-daemon --stacktrace --info -Dorg.gradle.jvmargs="-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError" || (echo "Build failed" && cat build/reports/tests/test/index.html && exit 1)

# 두 번째 스테이지: 실행 스테이지
FROM container-registry.oracle.com/graalvm/jdk:23

# 작업 디렉토리 설정
WORKDIR /app

# 첫 번째 스테이지에서 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 실행할 JAR 파일 지정 (Spring Profile: prod)
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]



## 첫 번째 스테이지: 빌드 스테이지
#FROM gradle:jdk-21-and-23-graal-jammy AS builder
#
## 작업 디렉토리 설정
#WORKDIR /app
#
## 소스 코드와 Gradle 래퍼 복사
#COPY build.gradle.kts .
#COPY settings.gradle.kts .
#
## 종속성 설치
#RUN gradle dependencies --no-daemon
#
## 소스 코드 복사
#COPY src src
#
## 애플리케이션 빌드
#RUN gradle build --no-daemon
#
## 두 번째 스테이지: 실행 스테이지
#FROM container-registry.oracle.com/graalvm/jdk:23
#
## 작업 디렉토리 설정
#WORKDIR /app
#
## 첫 번째 스테이지에서 빌드된 JAR 파일 복사
#COPY --from=builder /app/build/libs/*.jar app.jar
#
## 실행할 JAR 파일 지정
#ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]