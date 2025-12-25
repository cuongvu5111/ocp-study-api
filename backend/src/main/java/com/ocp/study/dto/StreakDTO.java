package com.ocp.study.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO trả về thông tin Study Streak của user.
 * 
 * @author OCP Study Team
 * @since 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StreakDTO {

    /**
     * Streak hiện tại (số ngày học liên tục)
     */
    private Integer currentStreak;

    /**
     * Streak dài nhất từ trước đến nay
     */
    private Integer longestStreak;

    /**
     * Ngày học cuối cùng
     */
    private LocalDate lastStudyDate;

    /**
     * Danh sách hoạt động 7 ngày gần nhất
     */
    private List<DailyActivityDTO> last7Days;

    /**
     * Đã học hôm nay chưa
     */
    private Boolean studiedToday;

    /**
     * Số phút đã học hôm nay
     */
    private Integer minutesToday;

    /**
     * Tổng số ngày đã học
     */
    private Long totalDaysStudied;
}
