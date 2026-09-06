package com.restroly.qrmenu.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpiLinkRequestDTO {

    private Long branchId;

    @NotBlank(message = "Account name is required")
    @Size(min = 2, max = 100, message = "Account name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "UPI ID is required")
    @Pattern(
        regexp = "^[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}$",
        message = "Invalid UPI ID format (e.g., username@bank, 9876543210@paytm)"
    )
    private String upiId;

    private Boolean isDefault;
}
