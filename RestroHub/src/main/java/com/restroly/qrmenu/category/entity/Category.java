// com/restroly/qrmenu/category/entity/Category.java
package com.restroly.qrmenu.category.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.restroly.qrmenu.food.entity.Food;
import com.restroly.qrmenu.menu.entity.Menu;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "T_category_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Builder.Default
    @Column(name = "is_delete")
    private Boolean isDelete = false;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    // ✅ CHANGE START: One-to-Many Relationship
    // mappedBy points to the 'category' field name in the Food class (singular)
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private Set<Food> foods = new HashSet<>();
    // ✅ CHANGE END

    @Builder.Default
    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    private Set<Menu> menu = new HashSet<>();

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}