package com.isturgi.backend.controllers;

import java.util.HashMap;
import java.util.Map;

public class ApiResponse {
    public static Map<String, Object> of(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        return response;
    }
}
