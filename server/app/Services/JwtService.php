<?php

namespace App\Services;

use Exception;

class JwtService
{
    private $secret;
    private $algorithm = 'HS256';
    private $expiresIn = 86400; // 24 hours

    public function __construct()
    {
        $this->secret = env('JWT_SECRET', 'your_secret_key_here');
        // Allow TTL to be configured via environment variable
        if (env('JWT_EXPIRES_IN')) {
            $this->expiresIn = (int)env('JWT_EXPIRES_IN');
        }
    }

    public function generateToken($userId, $email, $role, $name = 'User')
    {
        try {
            $now = time();
            $payload = [
                'iat' => $now,
                'exp' => $now + $this->expiresIn,
                'userId' => $userId,
                'email' => $email,
                'role' => $role,
                'name' => $name,
            ];

            $header = json_encode(['alg' => $this->algorithm, 'typ' => 'JWT']);
            $payload_encoded = json_encode($payload);

            $header_b64 = $this->base64_url_encode($header);
            $payload_b64 = $this->base64_url_encode($payload_encoded);

            $signature = hash_hmac('sha256', 
                $header_b64 . '.' . $payload_b64, 
                $this->secret, 
                true
            );
            $signature_b64 = $this->base64_url_encode($signature);

            $token = $header_b64 . '.' . $payload_b64 . '.' . $signature_b64;
            
            \Log::info('JWT Token Generated', [
                'userId' => $userId,
                'secret_length' => strlen($this->secret),
                'payload' => $payload,
                'token_length' => strlen($token)
            ]);
            
            return $token;
        } catch (Exception $e) {
            throw new Exception('Failed to generate token: ' . $e->getMessage());
        }
    }

    public function validateToken($token)
    {
        try {
            if (!is_string($token) || substr_count($token, '.') !== 2) {
                throw new Exception('Invalid token format');
            }

            [$header_b64, $payload_b64, $signature_b64] = explode('.', $token);

            // Verify signature
            $expected_signature = hash_hmac('sha256', 
                $header_b64 . '.' . $payload_b64, 
                $this->secret, 
                true
            );
            $expected_signature_b64 = $this->base64_url_encode($expected_signature);

            \Log::info('JWT Token Validation', [
                'token_parts' => [
                    'header' => strlen($header_b64),
                    'payload' => strlen($payload_b64),
                    'signature' => strlen($signature_b64)
                ],
                'secret_length' => strlen($this->secret),
                'signature_match' => $signature_b64 === $expected_signature_b64
            ]);

            if ($signature_b64 !== $expected_signature_b64) {
                throw new Exception('Invalid signature');
            }

            // Decode payload
            $payload = json_decode($this->base64_url_decode($payload_b64), true);

            // Check expiration
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                throw new Exception('Token expired');
            }

            return $payload;
        } catch (Exception $e) {
            throw new Exception('Invalid token: ' . $e->getMessage());
        }
    }

    public function getTokenFromRequest()
    {
        $header = request()->header('Authorization');
        if ($header && strpos($header, 'Bearer ') === 0) {
            return substr($header, 7);
        }
        return null;
    }

    private function base64_url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64_url_decode($data)
    {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 4 - strlen($data) % 4));
    }
}
