<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase; // Ensures a fresh database for every test

    /** @test */
    public function a_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    /** @test */
    public function a_user_can_login()
    {
        // Create a test user
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password'), // Ensure password is hashed
        ]);

        // Attempt to log in
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token']); // Ensure a token is returned
    }

    /** @test */
    public function an_invalid_user_cannot_login()
    {
        // Attempt to log in with incorrect credentials
        $response = $this->postJson('/api/login', [
            'email' => 'wrong@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
        $response->assertJson(['message' => 'Invalid credentials']);
    }

    /** @test */
    public function a_user_can_access_protected_route_with_token()
    {
        // Create a test user
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        // Get an auth token
        $token = $user->createToken('authToken')->plainTextToken;

        // Access protected route with the token
        $response = $this->getJson('/api/user', [
            'Authorization' => "Bearer $token"
        ]);

        $response->assertStatus(200);
        $response->assertJson(['email' => 'test@example.com']); // Ensure correct user is returned
    }

    /** @test */
    public function a_user_cannot_access_protected_route_without_token()
    {
        $response = $this->getJson('/api/user'); // No token provided
        $response->assertStatus(401);
    }
}
