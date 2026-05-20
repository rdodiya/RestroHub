package com.restroly.qrmenu.security.exception;

import org.springframework.security.authentication.LockedException;

public class UserLockedException extends LockedException {
    public UserLockedException(String msg) {
        super(msg);
    }
}
