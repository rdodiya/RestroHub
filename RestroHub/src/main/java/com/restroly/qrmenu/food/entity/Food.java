// com/restroly/qrmenu/food/entity/Food.java
package com.restroly.qrmenu.food.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.restroly.qrmenu.category.entity.Category;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "t_food_master", indexes = {
        @Index(name = "idx_food_name", columnList = "name"),
        @Index(name = "idx_food_available", columnList = "isAvailable"),
        // ✅ Add index on the new FK for performance
        @Index(name = "idx_food_category", columnList = "category_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "foodId")
@SQLDelete(sql = "UPDATE t_food_master SET is_delete = true WHERE food_id = ?")
@SQLRestriction("is_delete = false")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_id")
    private Long foodId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "isAvailable", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "is_veg")
    @Builder.Default
    private Boolean isVeg = true;

    @Column(name = "is_delete")
    @Builder.Default
    private Boolean isDelete = false;

    // ✅ CHANGE START: One-to-Many Relationship
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    // ✅ CHANGE END

    @PrePersist
    protected void onCreate() {
        dateCreated = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}