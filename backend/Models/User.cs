using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeatherTrackerAPI.Models;

[Table("Users")]
public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    [Column(TypeName = "nvarchar(255)")]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    [Column(TypeName = "nvarchar(255)")]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    [Column(TypeName = "nvarchar(100)")]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    [Column(TypeName = "nvarchar(100)")]
    public string LastName { get; set; } = string.Empty;
    
    [MaxLength(50)]
    [Column(TypeName = "nvarchar(50)")]
    public string Role { get; set; } = "User";
    
    public bool IsActive { get; set; } = true;
    
    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }
    
    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }
    
    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";
}
