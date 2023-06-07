using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using WorkloadManager.Models;

public class TeachingDeliveryConverter : JsonConverter<TeachingDelivery>
{
    public override TeachingDelivery Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using (var jsonDoc = JsonDocument.ParseValue(ref reader))
        {
            var jsonObject = jsonDoc.RootElement;
            var discriminator = jsonObject.GetProperty("Discriminator").GetString();

            TeachingDelivery teachingDelivery;

            if (discriminator == nameof(StandardTD))
            {
                teachingDelivery = JsonSerializer.Deserialize<StandardTD>(jsonObject.GetRawText(), options);
            }
            else if (discriminator == nameof(Fieldwork))
            {
                teachingDelivery = JsonSerializer.Deserialize<Fieldwork>(jsonObject.GetRawText(), options);
            }
            else
            {
                throw new InvalidOperationException($"Invalid discriminator value '{discriminator}' for {nameof(TeachingDelivery)}");
            }

            return teachingDelivery;
        }
    }

    public override void Write(Utf8JsonWriter writer, TeachingDelivery value, JsonSerializerOptions options)
    {
        JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }
}
