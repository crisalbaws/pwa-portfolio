import { useEffect, useState } from "react";
import { environment } from "./environments/environment";
import { LoginRequest, LoginResponse } from "./interfaces/interfaces.app";

const getHeaders = (): Headers => {
    const token = localStorage.getItem('PWA:Portfolio:dataUser');
    let haveTocken = token ? JSON.parse(token) : null;
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
    });
    if (haveTocken) {
        headers.append('Authorization', `Bearer ${haveTocken.data.token}`);
    }
    return headers;
};


export const loginRequest = async (endPoint: string, tipo: "APIREST" | "APIPASS", data: LoginRequest): Promise<LoginResponse> => {
    show();
    const url = `${getServer(tipo)}${endPoint}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const json = await response.json();

        // Validamos que la respuesta tenga las propiedades necesarias de ValidateUserResponse
        if (json && typeof json.statusCode === 'number' && json.statusCode == 200) {
            return json as LoginResponse;
        } else {
            throw new Error('La respuesta del servidor no coincide con el formato esperado.');
        }
    } catch (error: any) {
        return { data: null, message: 'Error en el servidor: ' + error.message, statusCode: error.statusCode };
    } finally {
        hide();
    }
};
export const getTickets = async (endPoint: string, tipo: "APIREST" | "APIPASS"): Promise<LoginResponse> => {
    show();
    const url = `${getServer(tipo)}${endPoint}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        const json = await response.json();
        if (json && typeof json.statusCode === 'number' && json.statusCode == 200) {
            return json as LoginResponse;
        } else {
            throw new Error('La respuesta del servidor no coincide con el formato esperado.');
        }
    } catch (error: any) {
        return { data: null, message: 'Error en el servidor: ' + error.message, statusCode: error.statusCode };
    } finally {
        hide();
    }
};


const getServer = (tipo: string): string => {
    switch (tipo) {
        case 'APIREST':
            return environment.APIREST;
        case 'APIPASS':
            return environment.APIPASS;
        default:
            throw new Error('Invalid Tipo');
    }
}

const show = () => {
    window.dispatchEvent(new CustomEvent('showSpinner', { detail: { showSpinner: true } }));
};
const hide = () => {
    window.dispatchEvent(new CustomEvent('showSpinner', { detail: { showSpinner: false } }));
};