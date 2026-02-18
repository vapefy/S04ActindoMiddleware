using System.Text.Json;
using System.Text.Json.Serialization;
using ActindoMiddleware.Infrastructure.Serialization;

namespace ActindoMiddleware.DTOs;

public sealed class ProductDto
{
    public string? id { get; set; }
    public string sku { get; set; } = default!;
    public int attributeSetId { get; set; }
    public string variantStatus { get; set; } = default!;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_parent_sku { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(EmptyStringJsonConverter<VariantsDto>))]
    public VariantsDto? _pim_variants { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_varcode { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_completeness { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_channels_connection { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_catalog { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_baseprice { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_flock_name { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_flock_number { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? _pim_flock_option { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? _pim_aermel_logo { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? _pim_aermel_logo_links { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_ean { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_products_keywords__actindo_basic__de_DE { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_products_keywords__actindo_basic__en_US { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_art_name__actindo_basic__de_DE { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_art_name__actindo_basic__en_US { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_art_nameactindo_basic_de_DE { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_art_nameactindo_basic_en_US { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_products_meta_title__actindo_basic__de_DE { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_products_meta_title__actindo_basic__en_US { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_products_meta_description__actindo_basic__de_DE { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? _pim_products_meta_description__actindo_basic__en_US { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(EmptyStringJsonConverter<PimPriceDto>))]
    public PimPriceDto? _pim_price { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(EmptyStringJsonConverter<PimPriceDto>))]
    public PimPriceDto? _pim_price_member { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonConverter(typeof(EmptyStringJsonConverter<PimPriceDto>))]
    public PimPriceDto? _pim_price_employee { get; set; }

    [JsonPropertyName("inventory")]
    public List<InventoryDto> Inventory { get; set; } = [];

    [JsonPropertyName("variants")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<ProductDto>? Variants { get; set; } = [];

    [JsonExtensionData]
    public Dictionary<string, JsonElement>? AdditionalProperties { get; set; }
}
