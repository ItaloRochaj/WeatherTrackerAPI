namespace WeatherTrackerAPI.Configurations
{
    public class SmtpProviderSettings
    {
        public string Server { get; set; } = string.Empty;
        public int Port { get; set; }
        public bool RequiresAppPassword { get; set; }
        public bool UseSsl { get; set; }
        public string Note { get; set; } = string.Empty;
    }

    public class SmtpSettings
    {
        public Dictionary<string, SmtpProviderSettings> Providers { get; set; } = new();
        public string ActiveProvider { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = string.Empty;

        public SmtpProviderSettings GetActiveProviderSettings()
        {
            if (string.IsNullOrEmpty(ActiveProvider) || !Providers.ContainsKey(ActiveProvider))
            {
                throw new InvalidOperationException("Provedor de email não configurado corretamente");
            }
            return Providers[ActiveProvider];
        }
    }
}