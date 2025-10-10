namespace CustomerApp.Models
{
    public class AddToCartRequestWithSpid
    {
        public int CustomerId { get; set; } 
        public int Spid { get; set; }       
        public int Quantity { get; set; }
    }

}
