package com.restroly.qrmenu.admin.dashboard.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatDTO {

    private String title;
    private String value;
    private String change;
    private Boolean positive;
    private String subtitle;
    private String iconKey;
    private String color;
    private Boolean pulse;
    private Double progress;
}