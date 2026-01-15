namespace ActindoMiddleware.DTOs;

public class PimPriceDto
{
    public int TaxClassId { get; set; }
    public List<PimCurrencyPriceDto> Currencies { get; set; } = [];
}

public class PimCurrencyPriceDto
{
    public string Currency { get; set; } = "EUR";
    public PimBasePriceDto BasePrice { get; set; } = default!;
}

public class PimBasePriceDto
{
    public bool IsGross { get; set; }
    public decimal Price { get; set; }
}
