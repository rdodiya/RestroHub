package com.restroly.qrmenu.whatsapp.service;

import java.util.List;
import java.util.Map;

public interface WhatsappService {
    void sendTemplateMessage(String toPhoneNumber, String templateName, List<Map<String, String>> bodyParameters);
}
