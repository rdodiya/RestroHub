package com.restroly.qrmenu.excel.service.generic;

import java.util.List;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

public interface GenericExcelImportService<T>{
    final Set<String> TRUTHY_VALUES = Set.of(
        // --- Core Tech Standards ---
        "true", "1", "t",

        // --- 🇬🇧 English ---
        "yes", "y", "yea", "yeah", "yep", "sure", "ok",

        // --- 🇮🇳 Hindi & Urdu ---
        "haan", "han", "ji", "हाँ", "जी", "ہاں", "جی",

        // --- 🇮🇳 Bengali & Assamese ---
        "haa", "hyan", "hya", "hoy", "হ্যাঁ", "হয়",

        // --- 🇮🇳 Marathi & Gujarati ---
        "ho", "ha", "हो", "હા",

        // --- 🇮🇳 Punjabi ---
        "aho", "ਹਾਂ",

        // --- 🇮🇳 Odia ---
        "hna", "aw", "ହଁ",

        // --- 🇮🇳 Tamil ---
        "aam", "aama", "aamam", "ஆம்", "ஆமாம்",

        // --- 🇮🇳 Telugu ---
        "avunu", "అవును",

        // --- 🇮🇳 Kannada ---
        "howdu", "ಹೌದು",

        // --- 🇮🇳 Malayalam ---
        "athe", "അതെ",

        // --- 🇸🇦 Arabic ---
        "naam", "na'am", "aywa", "نعم", "أيوا",

        // --- 🇨🇳 Chinese (Mandarin) ---
        "shi", "dui", "是", "对",

        // --- 🇫🇷 French ---
        "oui", "vrai",

        // --- 🇩🇪 German ---
        "ja", "wahr",

        // --- 🇪🇸 Spanish & 🇵🇹 Portuguese ---
        "si", "sí", "s", "sim", "verdadero", "verdade",

        // --- 🇯🇵 Japanese ---
        "hai", "はい",

        // --- 🇰🇷 Korean ---
        "ne", "ye", "네", "예",

        // --- 🇹🇭 Thai ---
        "chai", "ใช่",

        // --- 🇻🇳 Vietnamese ---
        "co", "có", "vang", "vâng", "da", "dạ", "đúng",

        // --- 🇷🇺 Russian ---
        "da", "да",

        // --- 🇮🇩 Indonesian & 🇲🇾 Malay ---
        "ya", "iya",

        // --- 🇹🇷 Turkish ---
        "evet", "e"
    );
    List<T> parseExcel(MultipartFile file) throws Exception;
}
