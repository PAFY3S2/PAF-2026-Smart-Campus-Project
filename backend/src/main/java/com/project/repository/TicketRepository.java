package com.project.repository;

import com.project.model.Ticket;
import com.project.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserId(String userId);
    List<Ticket> findByTechnicianId(String technicianId);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByTechnicianIdAndStatus(String technicianId, TicketStatus status);
    long countByTechnicianIdAndStatus(String technicianId, TicketStatus status);
    long countByTechnicianIdAndStatusIn(String technicianId, java.util.Collection<com.project.model.TicketStatus> statuses);
    long countByTechnicianIdAndPriorityInAndStatusNot(String technicianId, java.util.Collection<com.project.model.TicketPriority> priorities, com.project.model.TicketStatus status);
}
