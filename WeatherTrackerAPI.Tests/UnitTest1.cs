using Xunit;

namespace WeatherTrackerAPI.Tests;

public class BasicTests
{
    [Fact]
    public void SimpleMath_ShouldWork()
    {
        // Arrange
        var expected = 4;
        
        // Act
        var result = 2 + 2;
        
        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void String_ShouldNotBeEmpty()
    {
        // Arrange
        var text = "WeatherTrackerAPI.Tests";
        
        // Act & Assert
        Assert.NotNull(text);
        Assert.NotEmpty(text);
        Assert.Contains("Tests", text);
    }
}
