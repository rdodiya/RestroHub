package com.restroly.qrmenu.common.generic;


import org.mapstruct.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface GenericMapper<E,RD,D,U> { //E- Entity , RD - Request DTO, D - Response DTO , U - Update DTO

    E toEntity(RD rd);

    D toResponseDTO(E e);

    List<D> toResponseDTOList(List<E> eList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(U updateDTO, @MappingTarget E e);

    default PageResponseDTO<D> toPageResponseDTO(Page<E> e) {
        return PageResponseDTO.<D>builder()
                .content(toResponseDTOList(e.getContent()))
                .pageNumber(e.getNumber())
                .pageSize(e.getSize())
                .totalElements(e.getTotalElements())
                .totalPages(e.getTotalPages())
                .first(e.isFirst())
                .last(e.isLast())
                .empty(e.isEmpty())
                .build();
    }
}
