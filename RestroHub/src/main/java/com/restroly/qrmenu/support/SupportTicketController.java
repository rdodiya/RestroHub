package com.restroly.qrmenu.support;

import static com.restroly.qrmenu.common.util.ApiConstants.SECURE_API_VERSION;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Help &amp; Support. Any restaurant user can send a ticket; only the superadmin reads and resolves
 * them.
 */
@RestController
@RequestMapping(SECURE_API_VERSION)
@RequiredArgsConstructor
public class SupportTicketController {

  public record CreateRequest(
      @NotBlank @Size(max = 150) String title, @NotBlank @Size(max = 2000) String message) {}

  private final SupportTicketService service;

  @PostMapping("/support/tickets")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("isAuthenticated()")
  public SupportTicketDto create(@Valid @RequestBody CreateRequest request) {
    return service.create(request.title(), request.message());
  }

  @GetMapping("/admin/support-tickets")
  @PreAuthorize("@access.can('PLATFORM_ADMIN')")
  public List<SupportTicketDto> listOpen() {
    return service.listOpen();
  }

  @PostMapping("/admin/support-tickets/{id}/resolve")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("@access.can('PLATFORM_ADMIN')")
  public void resolve(@PathVariable Long id) {
    service.resolve(id);
  }
}
