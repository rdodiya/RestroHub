package com.restroly.qrmenu.registration;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {

  Optional<RegistrationRequest> findByUserId(Long userId);

  Optional<RegistrationRequest> findByVerificationToken(String token);

  List<RegistrationRequest> findByStatusOrderByCreatedAtAsc(RegistrationStatus status);
}
