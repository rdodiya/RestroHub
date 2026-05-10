package com.restroly.qrmenu.branch.mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.restroly.qrmenu.address.entity.Address;
import com.restroly.qrmenu.branch.dto.BranchRequestDTO;
import com.restroly.qrmenu.branch.dto.BranchResponseDTO;
import com.restroly.qrmenu.branch.entity.Branch;
import com.restroly.qrmenu.menu.entity.Menu;
import com.restroly.qrmenu.restaurant.entity.Restaurant;
import com.restroly.qrmenu.table.entity.Tables;

@Component
public class BranchMapper {

    // ========== REQUEST DTO → ENTITY ==========
    public Branch toEntity(BranchRequestDTO dto, Restaurant restaurant, Menu menu) {
        if (dto == null) return null;

        return Branch.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .isDelete(dto.getIsDelete() != null ? dto.getIsDelete() : false)
                .restaurant(restaurant)
                .address(toAddressEntity(dto.getAddress()))
                .menu(menu)
                .build();
    }

    // ========== ENTITY → RESPONSE DTO ==========
    public BranchResponseDTO toResponseDTO(Branch branch) {
        if (branch == null) return null;

        return BranchResponseDTO.builder()
                .branchId(branch.getBranchId())
                .name(branch.getName())
                .description(branch.getDescription())
                .isDelete(branch.getIsDelete())
                .createdDate(branch.getCreatedDate())
                .updatedDate(branch.getUpdatedDate())
                .restaurant(toRestaurantDTO(branch.getRestaurant()))
                .address(toAddressDTO(branch.getAddress()))
                .menu(toMenuDTO(branch.getMenu()))
                .tables(toTableDTOList(branch.getTables()))
                .tableCount(branch.getTables() != null ? branch.getTables().size() : 0)
                .build();
    }

    // ========== ENTITY → SUMMARY DTO (lightweight) ==========
    public BranchResponseDTO toSummaryDTO(Branch branch) {
        if (branch == null) return null;

        return BranchResponseDTO.builder()
                .branchId(branch.getBranchId())
                .name(branch.getName())
                .description(branch.getDescription())
                .isDelete(branch.getIsDelete())
                .createdDate(branch.getCreatedDate())
                .address(toAddressDTO(branch.getAddress()))
                .tableCount(branch.getTables() != null ? branch.getTables().size() : 0)
                .build();
    }

    // ========== LIST CONVERSION ==========
    public List<BranchResponseDTO> toResponseDTOList(List<Branch> branches) {
        if (branches == null) return Collections.emptyList();
        return branches.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BranchResponseDTO> toSummaryDTOList(List<Branch> branches) {
        if (branches == null) return Collections.emptyList();
        return branches.stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    // ========== UPDATE ENTITY FROM DTO ==========
    public void updateEntityFromDTO(Branch branch, BranchRequestDTO dto, Menu menu) {
        if (dto == null || branch == null) return;

        branch.setName(dto.getName());
        branch.setDescription(dto.getDescription());

        if (dto.getIsDelete() != null) {
            branch.setIsDelete(dto.getIsDelete());
        }

        if (dto.getAddress() != null) {
            updateAddressEntity(branch.getAddress(), dto.getAddress());
        }

        if (menu != null) {
            branch.setMenu(menu);
        }
    }

    // ========== PRIVATE HELPER METHODS ==========

    private Address toAddressEntity(BranchRequestDTO.AddressDTO dto) {
        if (dto == null) return null;

        Address address = new Address();
        address.setAdd1(dto.getAdd1());
        address.setAdd2(dto.getAdd2());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setCountry(dto.getCountry());
        address.setPostalCode(dto.getPostalCode());

        return address;
    }

    private void updateAddressEntity(Address address, BranchRequestDTO.AddressDTO dto) {
        if (address == null || dto == null) return;

        address.setAdd1(dto.getAdd1());
        address.setAdd2(dto.getAdd2());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setCountry(dto.getCountry());
        address.setPostalCode(dto.getPostalCode());
    }

    private BranchResponseDTO.RestaurantDTO toRestaurantDTO(Restaurant restaurant) {
        if (restaurant == null) return null;

        return BranchResponseDTO.RestaurantDTO.builder()
                .restId(restaurant.getRestId())
                .name(restaurant.getName())
                .build();
    }

    private BranchResponseDTO.AddressDTO toAddressDTO(Address address) {
        if (address == null) return null;

        String fullAddress = buildFullAddress(address);

        return BranchResponseDTO.AddressDTO.builder()
                .addId(address.getAddId())
                .add1(address.getAdd1())
                .add2(address.getAdd2())
                .city(address.getCity())
                .state(address.getState())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .fullAddress(fullAddress)
                .build();
    }

    private BranchResponseDTO.MenuDTO toMenuDTO(Menu menu) {
        if (menu == null) return null;

        return BranchResponseDTO.MenuDTO.builder()
                .menuId(menu.getMenuId())
                .menuName(menu.getMenuName())
                .menuDesc(menu.getMenuDesc())
                .categoryCount(menu.getCategories() != null ? menu.getCategories().size() : 0)
                .build();
    }

    private BranchResponseDTO.TableDTO toTableDTO(Tables table) {
        if (table == null) return null;

        return BranchResponseDTO.TableDTO.builder()
                .tableId(table.getTableId())
                .tableNumber(table.getTableNumber())
                .qrCodeUrl(table.getQrCodeUrl())
                .isActive(table.getIsActive())
                .build();
    }

    private List<BranchResponseDTO.TableDTO> toTableDTOList(List<Tables> tables) {
        if (tables == null) return Collections.emptyList();
        return tables.stream()
                .map(this::toTableDTO)
                .collect(Collectors.toList());
    }

    private String buildFullAddress(Address address) {
        StringBuilder sb = new StringBuilder();

        if (address.getAdd1() != null && !address.getAdd1().isEmpty()) {
            sb.append(address.getAdd1());
        }
        if (address.getAdd2() != null && !address.getAdd2().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getAdd2());
        }
        if (address.getCity() != null && !address.getCity().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getCity());
        }
        if (address.getState() != null && !address.getState().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getState());
        }
        if (address.getPostalCode() != null && !address.getPostalCode().isEmpty()) {
            if (sb.length() > 0) sb.append(" - ");
            sb.append(address.getPostalCode());
        }
        if (address.getCountry() != null && !address.getCountry().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(address.getCountry());
        }

        return sb.toString();
    }
}