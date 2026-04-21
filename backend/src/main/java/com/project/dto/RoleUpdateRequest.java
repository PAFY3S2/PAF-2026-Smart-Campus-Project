package com.project.dto;

import com.project.model.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    @NotNull(message = "Role cannot be null")
    private Role role;
}
