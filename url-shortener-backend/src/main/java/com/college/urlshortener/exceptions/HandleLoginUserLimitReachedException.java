package com.college.urlshortener.exceptions;

public class HandleLoginUserLimitReachedException extends RuntimeException {
    public HandleLoginUserLimitReachedException(String message){ super(message);}
}
