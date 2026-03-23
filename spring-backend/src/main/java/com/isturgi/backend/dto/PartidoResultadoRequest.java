package com.isturgi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PartidoResultadoRequest {
    @JsonProperty("resultado")
    private String resultado;

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }
}
