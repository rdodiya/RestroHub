package com.restroly.qrmenu.user.entity;

import com.restroly.qrmenu.superAdmin.entity.UserRoleRestaurant;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
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

	@OneToMany(mappedBy = "role")
	private Set<UserRoleRestaurant> userAssignments = new HashSet<>();


}
