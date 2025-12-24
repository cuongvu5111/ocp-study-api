package com.ocp.study.dto;

import lombok.Data;

/**
 * DTO cho login request.
 */
@Data
public class LoginRequest {
    private String username;
    private String password;
}
