// com/Restroly/qrmenu/table/entity/TableMaster.java
package com.restroly.qrmenu.table.entity;

import com.restroly.qrmenu.branch.entity.Branch;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "T_table_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tables {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "table_id")
    private Long tableId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "table_number", nullable = false)
    private Integer tableNumber;

    @Column(name = "qr_code_url")
    private String qrCodeUrl;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

}