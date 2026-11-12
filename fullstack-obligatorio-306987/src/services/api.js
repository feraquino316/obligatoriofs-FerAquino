const API_URL = import.meta.env.VITE_API_URL;

export const loginApi = async (username, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(msg);
    }
    return data;
};

export const registroApi = async (username, email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(msg);
    }
    return data;
};

export const getLecturasApi = async (token) => {
  const res = await fetch(`${API_URL}/lecturas?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data;  
};

export const eliminarLecturaApi = async (id, token) => {
  const res = await fetch(`${API_URL}/lecturas/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const getCategoriasApi = async (token) => {
  const res = await fetch(`${API_URL}/categorias`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;   
};

export const crearLecturaApi = async (lectura, token) => {
  const res = await fetch(`${API_URL}/lecturas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(lectura),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(msg);
  }
  return data.lectura;   
};

export const editarLecturaApi = async (id, cambios, token) => {
  const res = await fetch(`${API_URL}/lecturas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cambios),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(msg);
  }
  return data;
};

export const cambiarPlanApi = async (token) => {
  const res = await fetch(`${API_URL}/usuarios/plan`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;   
};

export const subirImagenApi = async (id, archivo, token) => {
  const formData = new FormData();
  formData.append('imagen', archivo);

  const res = await fetch(`${API_URL}/lecturas/${id}/imagen`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.lectura;   
};

const errorMsg = (data) => Array.isArray(data.message) ? data.message.join(', ') : data.message;

export const crearCategoriaApi = async (nombre, token) => {
  const res = await fetch(`${API_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nombre }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(errorMsg(data));
  return data.categoria;
};

export const editarCategoriaApi = async (id, nombre, token) => {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nombre }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(errorMsg(data));
  return data;
};

export const eliminarCategoriaApi = async (id, token) => {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(errorMsg(data));
  return data;
};