//package com.restroly.qrmenu.user.init;
//
//import com.restroly.qrmenu.user.entity.Role;
//import com.restroly.qrmenu.user.entity.User;
//import com.restroly.qrmenu.user.entity.UserRoleRestaurant;
//import com.restroly.qrmenu.user.repository.RoleRepository;
//import com.restroly.qrmenu.user.repository.UserRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.boot.ApplicationArguments;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.HashSet;
//import java.util.List;
//import java.util.ArrayList;
//import java.util.Set;
//
//@Component
//public class UserRolesFixInitializer implements ApplicationRunner {
//
//    private static final Logger log = LoggerFactory.getLogger(UserRolesFixInitializer.class);
//    private final UserRepository userRepository;
//    private final RoleRepository roleRepository;
//
//    public UserRolesFixInitializer(UserRepository userRepository, RoleRepository roleRepository) {
//        this.userRepository = userRepository;
//        this.roleRepository = roleRepository;
//    }
//
//    @Override
//    @Transactional
//    public void run(ApplicationArguments args) {
//        try {
//            // Ensure CUSTOMER role exists; create if missing
//            Role role = roleRepository.findByName("CUSTOMER")
//                    .orElseGet(() -> {
//                        Role r = Role.builder()
//                                .name("CUSTOMER")
//                                .description("Default customer role (auto-created)")
//                                .isActive(true)
//                                .build();
//                        Role saved = roleRepository.save(r);
//                        log.info("Created missing role: CUSTOMER (id={})", saved.getId());
//                        return saved;
//                    });
//
//            List<User> users = userRepository.findAll();
//            int fixed = 0;
//            for (User u : users) {
//                Set<UserRoleRestaurant> userRoleRestaurants = u.getUserRoleRestaurants();
//                if (userRoleRestaurants == null || userRoleRestaurants.isEmpty()) {
//                    if (userRoleRestaurants == null) {
//                        userRoleRestaurants = new HashSet<>();
//                    }
//                    UserRoleRestaurant urr = UserRoleRestaurant.builder()
//                            .user(u)
//                            .role(role)
//                            .restaurant(null) // if restaurant is optional
//                            .build();
//
//                    userRoleRestaurants.add(urr);
//
//                    u.setUserRoleRestaurants(userRoleRestaurants);
//                    userRepository.save(u);
//                    fixed++;
//            }
//            if (fixed > 0) {
//                log.info("Assigned CUSTOMER role to {} users who had no roles", fixed);
//            } else {
//                log.debug("No users without roles found; nothing to fix.");
//            }
//        } catch (Exception e) {
//            log.error("Error while fixing user roles at startup", e);
//        }
//    }
//}
