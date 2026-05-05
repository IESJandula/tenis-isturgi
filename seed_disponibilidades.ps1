param(
    [int]$DivisionId = 33,
    [string]$AdminToken = "admin@test.com",
    [string]$BaseUrl = "http://localhost:8080"
)

Write-Output "BaseUrl: $BaseUrl  DivisionId: $DivisionId"
$headers = @{ Authorization = "Bearer $AdminToken" }

# 1) Obtener jornadas de la division
$resJ = Invoke-RestMethod -Uri "$BaseUrl/api/jornadas?divisionId=$DivisionId" -Headers $headers -Method Get -ErrorAction Stop
$jornadas = $resJ.data
if (!$jornadas -or $jornadas.Count -eq 0) { Write-Error "No hay jornadas para la division $DivisionId"; exit 1 }
$jornada = $jornadas[0]
$jornadaId = $jornada.id
Write-Output "Usando jornada id=$jornadaId  Nombre=$($jornada.Nombre)  fechaLimiteDisponibilidad=$($jornada.fechaLimiteDisponibilidad)"

# 2) Obtener jugadores y filtrar por division
$resP = Invoke-RestMethod -Uri "$BaseUrl/api/jugadors" -Headers $headers -Method Get -ErrorAction Stop
$jugadores = $resP.data | Where-Object { $_.division -ne $null -and $_.division.id -eq $DivisionId }
if (!$jugadores -or $jugadores.Count -eq 0) { Write-Error "No hay jugadores en la division $DivisionId"; exit 1 }
Write-Output "Jugadores encontrados: $($jugadores.Count)"

# Slots de ejemplo (mismo formato que envía el frontend: string JSON)
$slotsObj = @{
    "sabado" = @{ "09:00" = $true; "11:00" = $true; "16:00" = $false; "18:00" = $false }
    "domingo" = @{ "09:00" = $true; "11:00" = $false; "16:00" = $true; "18:00" = $false }
}
$slotsJson = ($slotsObj | ConvertTo-Json -Compress)
# El frontend envia JSON.stringify(slots) por lo que slots se almacena como STRING; replicamos eso:
$slotsAsString = ($slotsJson | ConvertTo-Json -Compress)

# 3) Crear/actualizar disponibilidades por jugador
foreach ($p in $jugadores) {
    $body = @{
        jugador = @{ id = $p.id }
        jornada = @{ id = $jornadaId }
        slots = $slotsAsString
    }

    try {
        $resp = Invoke-RestMethod -Uri "$BaseUrl/api/disponibilidades" -Headers $headers -Method Post -ContentType 'application/json' -Body ($body | ConvertTo-Json -Depth 5)
        Write-Output "Disponibilidad creada para jugador id=$($p.id) nombre=$($p.Nombre) -> status OK"
    } catch {
        Write-Warning "Fallo creando disponibilidad para jugador id=$($p.id): $($_.Exception.Message)"
    }
}

Write-Output "Hecho. Para programar la jornada ejecuta:
POST $BaseUrl/api/jornadas/$jornadaId/schedule (con el mismo header Authorization)" }