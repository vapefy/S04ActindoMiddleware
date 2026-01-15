using System.Text.Json;
using System.Text.Json.Serialization;

namespace ActindoMiddleware.Application.DTOs.Customers;

public sealed class CustomerDto
{
    public string shortName { get; set; } = default!;
    public string? url { get; set; }
    public string? externalId { get; set; }
    public string? bankBlz { get; set; }
    public string? bankAcct { get; set; }
    public string? bankIban { get; set; }
    public string? bankBic { get; set; }
    public string? bankAccountOwner { get; set; }
    public string? languageCode { get; set; }
    public string? currency { get; set; }
    public string? paymentMethod { get; set; }
    public bool? customerLock { get; set; }
    public bool? deliveryLock { get; set; }
    public bool? reminderLock { get; set; }
    public bool? reminderAutomaticLock { get; set; }
    public string? bankMandateReference { get; set; }
    public string? bankMandateSignatureDate { get; set; }
    public string? notes { get; set; }
    public string? _customer_customertyp { get; set; }
    public string? _customer_debitorennumber { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement>? AdditionalProperties { get; set; }
}
