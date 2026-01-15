using System.Text.Json;
using System.Text.Json.Serialization;

namespace ActindoMiddleware.Application.DTOs.Customers;

public sealed class PrimaryAddressDto
{
    public int? id { get; set; }
    public string? salutation { get; set; }
    public string? company { get; set; }
    public string? name { get; set; }
    public string? firstName { get; set; }
    public string? taxId { get; set; }
    public string? vatId { get; set; }
    public string? countryLicensePlate { get; set; }
    public string? country2Digit { get; set; }
    public string? country3Digit { get; set; }
    public string? city { get; set; }
    public string? zip { get; set; }
    public string? address { get; set; }
    public string? address2 { get; set; }
    public string? email { get; set; }
    public string? phone { get; set; }
    public string? phone2 { get; set; }
    public string? mobile { get; set; }
    public string? fax { get; set; }
    public string? currency { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement>? AdditionalProperties { get; set; }
}
