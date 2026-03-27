package hopara.dataset;

public class NotFoundException extends RuntimeException {
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    String name;
    
    public NotFoundException(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
   @Override
   public String getMessage() {
        return name + " not found!";
   }

    
}
