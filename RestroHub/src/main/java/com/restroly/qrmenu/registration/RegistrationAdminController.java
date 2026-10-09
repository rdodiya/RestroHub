package com.restroly.qrmenu.registration;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** Superadmin review of self-service sign-ups. */
@RestController
@RequestMapping(SECURE_API_VERSION + "/admin/registration-requests")
@RequiredArgsConstructor
public class RegistrationAdminController {

  private final RegistrationService service;

  @GetMapping
  @PreAuthorize("@access.can('PLATFORM_ADMIN')")
  public List<RegistrationRequestDto> pending() {
    return service.listPending();
  }

  /**
   * Body: {"roleName": "MANAGER"}. Required when joining an existing restaurant, ignored for a new
   * one.
   */
  @PostMapping("/{id}/approve")
  @PreAuthorize("@access.can('PLATFORM_ADMIN')")
  public RegistrationRequestDto approve(
      @PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
    return service.approve(id, body == null ? null : body.get("roleName"));
  }

  /** Body: {"note": "reason"}. */
  @PostMapping("/{id}/reject")
  @PreAuthorize("@access.can('PLATFORM_ADMIN')")
  public RegistrationRequestDto reject(
      @PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
    return service.reject(id, body == null ? null : body.get("note"));
  }
}
