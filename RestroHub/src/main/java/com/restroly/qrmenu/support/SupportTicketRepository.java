package com.restroly.qrmenu.support;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

  List<SupportTicket> findTop100ByStatusOrderByCreatedAtDesc(SupportTicketStatus status);
}
