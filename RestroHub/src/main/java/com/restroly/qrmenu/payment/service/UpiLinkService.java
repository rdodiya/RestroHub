package com.restroly.qrmenu.payment.service;

import java.util.List;

import com.restroly.qrmenu.payment.dto.UpiLinkRequestDTO;
import com.restroly.qrmenu.payment.dto.UpiLinkResponseDTO;

public interface UpiLinkService {

    List<UpiLinkResponseDTO> getUpiLinksByBranch(Long branchId);

    UpiLinkResponseDTO getUpiLinkById(Long id);

    UpiLinkResponseDTO createUpiLink(Long branchId, UpiLinkRequestDTO requestDTO);

    UpiLinkResponseDTO setDefaultUpiLink(Long branchId, Long linkId);

    void deleteUpiLink(Long linkId);

    boolean testVerifyUpiLink(Long linkId);
}
