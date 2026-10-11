package com.restroly.qrmenu.user.controller;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

import com.restroly.qrmenu.user.dto.RoleAssignmentDto;
import com.restroly.qrmenu.user.service.RoleAssignmentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** Superadmin-only: who holds which role in which restaurant. */
@RestController
@RequestMapping(SECURE_API_VERSION + "/admin")
@RequiredArgsConstructor
public class RoleAssignmentController {

  public record AssignRequest(
      @NotNull Long userId, @NotNull Long restaurantId, @NotNull Long roleId) {}

  private final RoleAssignmentService service;

  @GetMapping("/restaurants")
  @PreAuthorize("@access.can('PLATFORM_ADMIN')")
  public List<Map<String, Object>> restaurants() {
    return service.restaurants();
  }

  @GetMapping("/role-assignments")
  @PreAuthorize("@access.can('PLATFORM_ADMIN')")
  public List<RoleAssignmentDto> list() {
    return service.list();
  }

  @PostMapping("/role-assignments")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("@access.can('PLATFORM_ADMIN')")
  public RoleAssignmentDto assign(@Valid @RequestBody AssignRequest request) {
    return service.assign(request.userId(), request.restaurantId(), request.roleId());
  }

  @DeleteMapping("/role-assignments/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("@access.can('PLATFORM_ADMIN')")
  public void revoke(@PathVariable Long id) {
    service.revoke(id);
  }
}
