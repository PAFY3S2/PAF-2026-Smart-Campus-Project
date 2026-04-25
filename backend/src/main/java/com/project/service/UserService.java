package com.project.service;

import com.project.model.User;
import com.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public User updateProfile(String id, java.util.Map<String, Object> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("phoneNumber")) user.setPhoneNumber((String) updates.get("phoneNumber"));
        if (updates.containsKey("address")) user.setAddress((String) updates.get("address"));
        if (updates.containsKey("department")) user.setDepartment((String) updates.get("department"));
        if (updates.containsKey("specialty")) user.setSpecialty((String) updates.get("specialty"));
        if (updates.containsKey("experienceYears")) user.setExperienceYears((Integer) updates.get("experienceYears"));
        if (updates.containsKey("bio")) user.setBio((String) updates.get("bio"));
        if (updates.containsKey("workingHours")) user.setWorkingHours((String) updates.get("workingHours"));
        if (updates.containsKey("availability")) user.setAvailability((Boolean) updates.get("availability"));
        
        if (updates.containsKey("expertise")) {
            user.setExpertise((java.util.List<String>) updates.get("expertise"));
        }
        if (updates.containsKey("workLocations")) {
            user.setWorkLocations((java.util.List<String>) updates.get("workLocations"));
        }

        return userRepository.save(user);
    }
}
