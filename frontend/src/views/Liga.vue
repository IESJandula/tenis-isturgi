<template>
  <div class="liga-container">
    <h1>🏆 Clasificación - Liga Invierno 2025</h1>
    
    <div class="filtros">
      <button class="activo">División Oro</button>
      <button>División Plata</button>
    </div>

    <div class="tabla-wrapper">
      <table class="tabla-clasificacion">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Jugador</th>
            <th>PJ</th> <th>PG</th> <th>PP</th> <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="posicion-1">1</td>
            <td class="jugador">Rafa Nadal</td>
            <td>5</td>
            <td>5</td>
            <td>0</td>
            <td class="puntos">15</td>
          </tr>
          <tr>
            <td class="posicion-2">2</td>
            <td class="jugador">Carlos Alcaraz</td>
            <td>5</td>
            <td>4</td>
            <td>1</td>
            <td class="puntos">13</td>
          </tr>
          <tr>
            <td class="posicion-3">3</td>
            <td class="jugador">Novak Djokovic</td>
            <td>5</td>
            <td>3</td>
            <td>2</td>
            <td class="puntos">10</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.liga-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  color: white;
}

h1 {
  text-align: center;
  color: #bfff00;
  margin-bottom: 30px;
}

.filtros {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.filtros button {
  background: #333;
  color: white;
  border: 1px solid #555;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 20px;
  font-weight: bold;
}

.filtros button.activo {
  background: #bfff00;
  color: #222;
  border-color: #bfff00;
}

.tabla-wrapper {
  overflow-x: auto;
}

.tabla-clasificacion {
  width: 100%;
  border-collapse: collapse;
  background-color: #2c2c2c;
  border-radius: 8px;
  overflow: hidden;
}

.tabla-clasificacion th {
  background-color: #bfff00;
  color: #222;
  padding: 15px;
  text-align: center;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.tabla-clasificacion td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #444;
}

.jugador {
  text-align: left !important;
  font-weight: bold;
}

.puntos {
  font-weight: bold;
  color: #bfff00;
  font-size: 1.1rem;
}

.posicion-1 { color: gold; font-weight: bold; }
.posicion-2 { color: silver; font-weight: bold; }
.posicion-3 { color: #cd7f32; font-weight: bold; }
</style>