# Script para insertar jugadores de prueba
# Ejecuta en PowerShell: .\seed_jugadores.ps1

$apiUrl = "http://localhost:8080/api/jugadors"
$token = "admin@test.com"  # Dev mode: el backend lo acepta sin verificación

$jugadores = @(
    @{
        Nombre = "Juan"
        Apellidos = "Pérez García"
        Email = "juan@test.com"
        Telefono = "645123456"
        Nivel = "Avanzado"
        Categoria = "Absoluto"
        FechaNacimiento = "1990-05-15"
        NumeroSocio = "001"
        Puntos = 100
        division = @{ id = 1 }
    },
    @{
        Nombre = "María"
        Apellidos = "López Martín"
        Email = "maria@test.com"
        Telefono = "645654321"
        Nivel = "Medio"
        Categoria = "Absoluto"
        FechaNacimiento = "1995-03-22"
        NumeroSocio = "002"
        Puntos = 75
        division = @{ id = 1 }
    },
    @{
        Nombre = "Pedro"
        Apellidos = "González Ruiz"
        Email = "pedro@test.com"
        Telefono = "645789123"
        Nivel = "Avanzado"
        Categoria = "Absoluto"
        FechaNacimiento = "1988-07-10"
        NumeroSocio = "003"
        Puntos = 120
        division = @{ id = 1 }
    },
    @{
        Nombre = "Ana"
        Apellidos = "Sánchez Moreno"
        Email = "ana@test.com"
        Telefono = "645456789"
        Nivel = "Iniciado"
        Categoria = "Absoluto"
        FechaNacimiento = "2000-11-05"
        NumeroSocio = "004"
        Puntos = 50
        division = @{ id = 1 }
    },
    @{
        Nombre = "Carlos"
        Apellidos = "Fernández López"
        Email = "carlos@test.com"
        Telefono = "645321654"
        Nivel = "Medio"
        Categoria = "Absoluto"
        FechaNacimiento = "1992-09-18"
        NumeroSocio = "005"
        Puntos = 85
        division = @{ id = 1 }
    }
)

Write-Host "🌱 Insertando jugadores..." -ForegroundColor Green

foreach ($jugador in $jugadores) {
    $body = $jugador | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl `
            -Method Post `
            -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
            -Body $body
        
        Write-Host "✅ $($jugador.Nombre) $($jugador.Apellidos) creado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error creando $($jugador.Nombre): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "✨ Listo!" -ForegroundColor Green
