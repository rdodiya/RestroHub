package com.restroly.qrmenu.restaurant.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.restroly.qrmenu.branch.entity.Branch;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "t_restaurant_master")
public class Restaurant {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rest_id")
	private long restId;

	@Column(name = "name", nullable = false, length = 255)
	private String name;

	@Column(name = "description", nullable = false, length = 255)
	private String description;

	@Column(name = "phone_number")
	private String phoneNumber;

	@OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	private List<Branch> branches;

	@Column(name = "isActive")
	@Builder.Default
	private Boolean isActive = true;

	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_date")
	private LocalDateTime updatedDate;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedDate = LocalDateTime.now();
	}

	@PreUpdate  // this automaticatically update updatedDate when existing entity update
	protected void onUpdate() {
		updatedDate = LocalDateTime.now();
	}
}
