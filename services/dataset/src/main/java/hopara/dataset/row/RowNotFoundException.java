package hopara.dataset.row;

public class RowNotFoundException extends RuntimeException{
   /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    String name;
    
    public RowNotFoundException(String name) {
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
