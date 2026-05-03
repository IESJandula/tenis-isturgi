# Script de Testeo Completo - Flujo End-to-End
# Prueba todos los endpoints clave

$BaseUrl = "http://localhost:8080"
$TestToken = "Bearer test"

function Request-Api($method, $endpoint, $body = $null) {
    $url = "$BaseUrl$endpoint"
    $headers = @{
        "Authorization" = $TestToken
        "Content-Type" = "application/json"
    }
    
    try {
        if ($body) {
            $response = Invoke-RestMethod -Uri $url -Method $method -Headers $headers -Body $body
        } else {
            $response = Invoke-RestMethod -Uri $url -Method $method -Headers $headers
        }
        return @{ Status = "OK"; Data = $response; Code = 200 }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        return @{ Status = "ERROR"; Code = $statusCode; Message = $_.Exception.Message }
    }
}

Write-Host "=== TESTEO COMPLETO DE API ===" -ForegroundColor Green
Write-Host ("Timestamp: {0}" -f (Get-Date))

# 1. Crear Temporada
Write-Host "`n[1/8] Creando Temporada..." -ForegroundColor Yellow
$seasonBody = @{
    nombre = "Temporada 2026"
    anio = 2026
} | ConvertTo-Json
$season = Request-Api "POST" "/api/temporadas" $seasonBody
if ($season.Code -eq 200) {
    $seasonId = $season.Data.id
    Write-Host ("OK Temporada creada: {0}" -f $seasonId) -ForegroundColor Green
} else {
    Write-Host ("ERROR temporada: {0}" -f $season.Code) -ForegroundColor Red
    exit 1
}

# 2. Crear Division
Write-Host "`n[2/8] Creando Division..." -ForegroundColor Yellow
$divisionBody = @{
    nombre = "A"
    temporada_id = $seasonId
} | ConvertTo-Json
$division = Request-Api "POST" "/api/divisiones" $divisionBody
if ($division.Code -eq 200) {
    $divisionId = $division.Data.id
    Write-Host ("OK Division creada: {0}" -f $divisionId) -ForegroundColor Green
} else {
    Write-Host ("ERROR division: {0}" -f $division.Code) -ForegroundColor Red
    exit 1
}

# 3. Crear Jugadores
Write-Host "`n[3/8] Creando Jugadores..." -ForegroundColor Yellow
$players = @()
$i = 1
while ($i -le 4) {
    $playerBody = @{
        nombre = ("Jugador{0}" -f $i)
        apellidos = ("Apellido{0}" -f $i)
        email = ("jugador{0}@test.com" -f $i)
        nivel = "B"
        division_id = $divisionId
    } | ConvertTo-Json
    $player = Request-Api "POST" "/api/jugadores" $playerBody
    if ($player.Code -eq 200) {
        $players += $player.Data
        Write-Host ("OK Jugador {0} creado: {1}" -f $i, $player.Data.id) -ForegroundColor Green
    } else {
        Write-Host ("ERROR jugador {0}: {1}" -f $i, $player.Code) -ForegroundColor Red
    }
    $i = $i + 1
}

# 4. Generar Calendario
Write-Host "`n[4/8] Generando Calendario..." -ForegroundColor Yellow
$calendarBody = @{
    division_id = $divisionId
} | ConvertTo-Json
$calendar = Request-Api "POST" "/api/ligas/generar-calendario" $calendarBody
if ($calendar.Code -eq 200) {
    Write-Host "OK Calendario generado" -ForegroundColor Green
    $journeys = $calendar.Data.jornadas
    if ($journeys.Count -gt 0) {
        $journeyId = $journeys[0].id
        Write-Host ("OK Primera jornada: {0}" -f $journeyId) -ForegroundColor Green
    }
} else {
    Write-Host ("ERROR calendario: {0}" -f $calendar.Code) -ForegroundColor Red
}

# 5. Listar Partidos
Write-Host "`n[5/8] Listando Partidos..." -ForegroundColor Yellow
$matches = Request-Api "GET" "/api/partidos"
if ($matches.Code -eq 200) {
    Write-Host ("OK Partidos: {0} encontrados" -f $matches.Data.Count) -ForegroundColor Green
    if ($matches.Data.Count -gt 0) {
        $firstMatch = $matches.Data[0]
        $matchId = $firstMatch.id
        Write-Host ("OK Primer partido: {0}" -f $matchId) -ForegroundColor Green
    }
} else {
    Write-Host ("ERROR partidos: {0}" -f $matches.Code) -ForegroundColor Red
}

# 6. Guardar Resultado Provisional
if ($matchId) {
    Write-Host "`n[6/8] Guardando Resultado Provisional..." -ForegroundColor Yellow
    $resultBody = @{
        sets_favor = 2
        sets_contra = 0
        juegos_favor = 6
        juegos_contra = 4
        jugador_que_guardo = $players[0].id
    } | ConvertTo-Json
    $result = Request-Api "PUT" ("/api/partidos/{0}/resultado-provisional" -f $matchId) $resultBody
    if ($result.Code -eq 200) {
        Write-Host "OK Resultado provisional guardado" -ForegroundColor Green
    } else {
        Write-Host ("ERROR resultado: {0}" -f $result.Code) -ForegroundColor Red
    }
}

# 7. Confirmar Resultado
if ($matchId) {
    Write-Host "`n[7/8] Confirmando Resultado..." -ForegroundColor Yellow
    $confirmBody = @{} | ConvertTo-Json
    $confirm = Request-Api "PUT" ("/api/partidos/{0}/resultado-confirmar" -f $matchId) $confirmBody
    if ($confirm.Code -eq 200) {
        Write-Host "OK Resultado confirmado" -ForegroundColor Green
    } else {
        Write-Host ("ERROR confirmar: {0}" -f $confirm.Code) -ForegroundColor Red
    }
}

# 8. Probar Disponibilidades
if ($journeyId -and $players.Count -gt 0) {
    Write-Host "`n[8/8] Probando Disponibilidades..." -ForegroundColor Yellow
    $availBody = @{
        jugador_id = $players[0].id
        jornada_id = $journeyId
        slots = @("08:00", "09:00")
    } | ConvertTo-Json
    $availability = Request-Api "POST" "/api/disponibilidades" $availBody
    if ($availability.Code -eq 200) {
        Write-Host "OK Disponibilidad guardada" -ForegroundColor Green
    } else {
        Write-Host ("ERROR disponibilidad: {0}" -f $availability.Code) -ForegroundColor Red
    }
}

Write-Host "`n=== TESTEO COMPLETADO ===" -ForegroundColor Green
Write-Host ("Timestamp: {0}" -f (Get-Date)) -ForegroundColor Cyan
