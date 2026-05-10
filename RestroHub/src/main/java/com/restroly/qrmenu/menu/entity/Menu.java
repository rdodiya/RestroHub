package com.restroly.qrmenu.menu.entity;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.category.entity.Category;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_menu_master")
public class Menu {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "menu_id")
	private long menuId;

	@Column(name = "menu_name", nullable = false)
	private String menuName;

	@Column(name = "menu_desc")
	private String menuDesc;

	@Column(name = "is_deleted")
	private boolean isDeleted;

	@Column(name = "updated_date")
	private Date updatedDate;

	@Column(name = "created_date")
	private Date createdDate;

	@Builder.Default
	@ManyToMany
	@JoinTable(
			name = "T_rel_MenuCat",
			joinColumns = @JoinColumn(name = "menu_id"),
			inverseJoinColumns = @JoinColumn(name = "category_id")
	)
	private List<Category> categories = new ArrayList<>();

	@OneToOne
	@JoinColumn(name = "branch_id")
	private Branch branch;
}
