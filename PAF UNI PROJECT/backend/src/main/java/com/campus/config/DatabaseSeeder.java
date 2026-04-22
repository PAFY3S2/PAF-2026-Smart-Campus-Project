package com.campus.config;

import com.campus.model.Resource;
import com.campus.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(ResourceRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                System.out.println("Seeding database with sample resources...");

                Resource r1 = new Resource();
                r1.setName("Main Auditorium");
                r1.setType("ROOM");
                r1.setLocation("Building A - Ground Floor");
                r1.setCapacity(500);
                r1.setStatus("ACTIVE");
                r1.setImageUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800");

                Resource r2 = new Resource();
                r2.setName("Computing Lab 1");
                r2.setType("LAB");
                r2.setLocation("Building B - 2nd Floor");
                r2.setCapacity(40);
                r2.setStatus("ACTIVE");
                r2.setImageUrl("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800");

                Resource r3 = new Resource();
                r3.setName("Projector Setup Alpha");
                r3.setType("EQUIPMENT");
                r3.setLocation("IT Store Room");
                r3.setCapacity(0);
                r3.setStatus("OUT_OF_SERVICE");
                r3.setImageUrl("https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800");

                Resource r4 = new Resource();
                r4.setName("Study Room C12");
                r4.setType("ROOM");
                r4.setLocation("Library - 1st Floor");
                r4.setCapacity(6);
                r4.setStatus("ACTIVE");
                r4.setImageUrl("https://images.unsplash.com/photo-1497366216548-37526070297c?w=800");

                repository.saveAll(Arrays.asList(r1, r2, r3, r4));
                System.out.println("Seeding completed.");
            } else {
                System.out.println("Database already contains data. Seeding skipped.");
            }
        };
    }
}
