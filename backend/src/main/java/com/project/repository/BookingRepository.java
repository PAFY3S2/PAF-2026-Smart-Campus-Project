package com.project.repository;

import com.project.model.Booking;
import com.project.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByResourceId(String resourceId);
    List<Booking> findByResourceIdAndDate(String resourceId, String date);
    List<Booking> findByResourceIdAndDateAndStatusNot(String resourceId, String date, BookingStatus status);
}
