const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let usuarios = [
  { id_usuario: 1, nombre_completo: 'Don José María López', telefono: '3104567890', rol: 'productor', vereda_direccion: 'Vereda Guacamayas', acepta_habeas_data: true },
  { id_usuario: 2, nombre_completo: 'María Fernanda Parra', telefono: '3119876543', rol: 'productor', vereda_direccion: 'Vereda El Escobal', acepta_habeas_data: true },
  { id_usuario: 3, nombre_completo: 'Fruver La Cosecha Tunja', telefono: '3201112233', rol: 'comerciante', vereda_direccion: 'Plaza Sur Tunja', acepta_habeas_data: true },
  { id_usuario: 4, nombre_completo: 'Admin AgroDirecto', telefono: '3000000000', rol: 'admin', vereda_direccion: 'Casco Urbano Ramiriquí', acepta_habeas_data: true }
];

let productos = [
  { id_producto: 101, productor_nombre: 'Don José María López', telefono_productor: '573104567890', vereda: 'Vereda Guacamayas', nombre_producto: 'Papa Pastusa Suprema', categoria: 'Tubérculos', precio_unitario: 1800, unidad_medida: 'kg', cantidad_disponible: 500, fecha_cosecha: '2026-11-18', estado: 'disponible' },
  { id_producto: 102, productor_nombre: 'María Fernanda Parra', telefono_productor: '573119876543', vereda: 'Vereda El Escobal', nombre_producto: 'Feijoa Orgánica Fresca', categoria: 'Frutas', precio_unitario: 4500, unidad_medida: 'kg', cantidad_disponible: 120, fecha_cosecha: '2026-11-18', estado: 'disponible' },
  { id_producto: 103, productor_nombre: 'Don José María López', telefono_productor: '573104567890', vereda: 'Vereda Guacamayas', nombre_producto: 'Arracacha Amarilla', categoria: 'Tubérculos', precio_unitario: 2600, unidad_medida: 'kg', cantidad_disponible: 300, fecha_cosecha: '2026-11-17', estado: 'disponible' },
  { id_producto: 104, productor_nombre: 'María Fernanda Parra', telefono_productor: '573119876543', vereda: 'Vereda El Escobal', nombre_producto: 'Mora de Castilla Seleccionada', categoria: 'Frutas', precio_unitario: 5200, unidad_medida: 'kg', cantidad_disponible: 85, fecha_cosecha: '2026-11-18', estado: 'disponible' }
];

let pedidos = [
  { id_pedido: 5001, comprador_nombre: 'Fruver La Cosecha Tunja', id_producto: 101, nombre_producto: 'Papa Pastusa Suprema', cantidad_solicitada: 100, valor_total: 180000, estado_pedido: 'confirmado', fecha_pedido: '2026-11-18' }
];

app.get('/api/productos', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const cat = req.query.categoria || 'Todas';
  const lista = productos.filter(p => {
    const okCat = cat === 'Todas' || p.categoria === cat;
    const okQ = !q || p.nombre_producto.toLowerCase().includes(q) || p.vereda.toLowerCase().includes(q);
    return okCat && okQ && p.cantidad_disponible > 0;
  });
  res.json(lista);
});

app.post('/api/productos', (req, res) => {
  const nuevo = {
    id_producto: Date.now(),
    productor_nombre: req.body.productor_nombre,
    telefono_productor: req.body.telefono_productor,
    vereda: req.body.vereda,
    nombre_producto: req.body.nombre_producto,
    categoria: req.body.categoria,
    precio_unitario: Number(req.body.precio_unitario),
    unidad_medida: 'kg',
    cantidad_disponible: Number(req.body.cantidad_disponible),
    fecha_cosecha: '2026-11-18',
    estado: 'disponible'
  };
  productos.unshift(nuevo);
  res.status(201).json(nuevo);
});

app.get('/api/pedidos', (req, res) => res.json(pedidos));

app.post('/api/pedidos', (req, res) => {
  const prod = productos.find(p => p.id_producto === Number(req.body.id_producto));
  const cant = Number(req.body.cantidad_solicitada);
  if (!prod || prod.cantidad_disponible < cant) return res.status(400).json({ error: 'Sin stock' });
  prod.cantidad_disponible -= cant;
  const ped = {
    id_pedido: Math.floor(5000 + Math.random() * 4999),
    comprador_nombre: req.body.comprador_nombre,
    id_producto: prod.id_producto,
    nombre_producto: prod.nombre_producto,
    cantidad_solicitada: cant,
    valor_total: cant * prod.precio_unitario,
    estado_pedido: 'pendiente',
    fecha_pedido: '2026-11-18'
  };
  pedidos.unshift(ped);
  res.status(201).json(ped);
});

app.get('/api/usuarios', (req, res) => res.json(usuarios));

app.post('/api/usuarios', (req, res) => {
  const u = { id_usuario: usuarios.length + 1, ...req.body };
  usuarios.push(u);
  res.status(201).json(u);
});

app.listen(PORT, () => console.log('Servidor AgroDirecto activo en http://localhost:' + PORT));
