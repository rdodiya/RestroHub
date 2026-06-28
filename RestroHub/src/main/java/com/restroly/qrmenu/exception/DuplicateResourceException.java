package com.restroly.qrmenu.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateResourceException extends ResourceAlreadyExistsException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}