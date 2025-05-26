plugins {
	java
	id("org.springframework.boot") version "3.4.5"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-data-redis")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-websocket")
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-actuator")

	// 더미 데이터 생성을 위한 라이브러리
	implementation("net.datafaker:datafaker:2.1.0")

	//db관련
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	runtimeOnly("com.mysql:mysql-connector-j")

	//swagger 의존성
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.5")

	// JWT & JSON
	implementation("io.jsonwebtoken:jjwt-api:0.12.6")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")
	implementation("com.google.code.gson:gson")
	implementation("com.googlecode.json-simple:json-simple:1.1.1")

	// Amazon s3
	// core만
	implementation("software.amazon.awssdk:s3:2.25.13")

	//전자서명 API
	implementation ("org.springframework.boot:spring-boot-starter-webflux")

	//thymeleaf
	implementation ("org.springframework.boot:spring-boot-starter-thymeleaf")

	//엑셀 API
	implementation("org.apache.poi:poi-ooxml:5.4.1") {
		exclude(group = "org.apache.commons", module = "commons-compress")
	}
	implementation("org.apache.commons:commons-compress:1.26.0")

}

tasks.withType<Test> {
	useJUnitPlatform()
}
