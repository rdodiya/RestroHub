package com.restroly.qrmenu.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "t_role_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "role_id")
	private Long id;

	@Column(name = "role_name", nullable = false, unique = true)
	private String name;

	@Column(name = "role_desc")
	private String description;

	@Column(name = "is_active")
	@Builder.Default
	private Boolean isActive = true;

//	@ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
//	private List<User> users;

	@OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
	private Set<UserRoleRestaurant> userRoleRestaurants = new HashSet<>();



}
