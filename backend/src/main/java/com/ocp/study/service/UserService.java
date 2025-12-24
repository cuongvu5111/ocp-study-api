package com.ocp.study.service;

import com.ocp.study.entity.User;
import com.ocp.study.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Service helper để lấy current authenticated user.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Lấy current authenticated user từ SecurityContext
     * 
     * @return Current user
     * @throws RuntimeException nếu user không tồn tại
     */
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not authenticated"));
    }
}
