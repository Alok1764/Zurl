package com.college.urlshortener.exceptions;

public class HandleAnonymousUserLimitReachedException extends RuntimeException{
    public HandleAnonymousUserLimitReachedException(String message){super(message);}
}
