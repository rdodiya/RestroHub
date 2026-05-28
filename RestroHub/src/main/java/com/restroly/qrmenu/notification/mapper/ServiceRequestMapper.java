package com.restroly.qrmenu.notification.mapper;

import com.restroly.qrmenu.notification.dto.ServiceRequestResponseDTO;
import com.restroly.qrmenu.notification.entity.ServiceRequest;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ServiceRequestMapper {

    ServiceRequestResponseDTO toResponseDTO(ServiceRequest entity);

    List<ServiceRequestResponseDTO> toResponseDTOList(List<ServiceRequest> entities);
}
