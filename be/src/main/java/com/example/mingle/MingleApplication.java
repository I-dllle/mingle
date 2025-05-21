package com.example.mingle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class MingleApplication {

	public static void main(String[] args) {
		try {
			SpringApplication.run(MingleApplication.class, args);
		} catch (Exception e) {
			e.printStackTrace(); // 예외 로그 직접 출력
		}	}
}
