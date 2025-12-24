package com.ocp.study.dto;

import lombok.Data;

/**
 * DTO cho register request.
 */
@Data
public class RegisterRequest {
    private String username;
    private String fullName;
    private String password;
    private String email;
}
