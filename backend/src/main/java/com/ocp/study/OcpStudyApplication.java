package com.ocp.study;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Application class cho OCP Study API.
 * Ứng dụng backend hỗ trợ ôn thi chứng chỉ OCP Java SE 11.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@SpringBootApplication
public class OcpStudyApplication {

    public static void main(String[] args) {
        SpringApplication.run(OcpStudyApplication.class, args);
    }
}
