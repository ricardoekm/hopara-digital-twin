package hopara.dataset.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import hopara.dataset.NotFoundException;

@ControllerAdvice
class ErrorHandler {
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> sourceNotFound(NotFoundException exception) {
    	return new ResponseEntity<>(new Response(false, exception.getName() + " not found"), HttpStatus.NOT_FOUND);
    }
    
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Object> forbidden(SecurityException exception) {
    	return new ResponseEntity<>(new Response(false, exception.getMessage()), HttpStatus.FORBIDDEN);
    }
    
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object>  illegalArgumentException(IllegalArgumentException exception) {
        return new ResponseEntity<>(new Response(false, exception.getMessage()), HttpStatus.UNPROCESSABLE_ENTITY);
    }
    
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ExceptionHandler(BadSqlGrammarException.class)
    public ResponseEntity<Object>  badSqlGrammarException(BadSqlGrammarException exception) {
        return new ResponseEntity<>(new Response(false, exception.getMessage() + " " + exception.getCause()), HttpStatus.UNPROCESSABLE_ENTITY);
    }
}