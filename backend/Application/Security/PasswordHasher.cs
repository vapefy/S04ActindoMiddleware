using System;
using System.Security.Cryptography;

namespace ActindoMiddleware.Application.Security;

public static class PasswordHasher
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int DefaultIterations = 150_000;

    public static PasswordHashResult Hash(string password)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(password);

        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            DefaultIterations,
            HashAlgorithmName.SHA256,
            HashSize);

        return new PasswordHashResult(salt, hash, DefaultIterations);
    }

    public static bool Verify(string password, byte[] salt, byte[] expectedHash, int iterations)
    {
        if (string.IsNullOrWhiteSpace(password))
            return false;
        if (salt is null || salt.Length == 0)
            return false;
        if (expectedHash is null || expectedHash.Length == 0)
            return false;
        if (iterations <= 0)
            return false;

        var computed = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            iterations,
            HashAlgorithmName.SHA256,
            expectedHash.Length);

        return CryptographicOperations.FixedTimeEquals(computed, expectedHash);
    }
}

public sealed record PasswordHashResult(byte[] Salt, byte[] Hash, int Iterations);

