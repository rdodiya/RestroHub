package com.restroly.qrmenu.security.exception;

import org.springframework.security.authentication.DisabledException;

public class UserDisabledException extends DisabledException {
    public UserDisabledException(String msg) {
        super(msg);
    }
}
