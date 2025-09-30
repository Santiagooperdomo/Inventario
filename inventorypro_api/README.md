# API para conectar tu frontend con XAMPP (MySQL)

**Resumen rápido**
- Este paquete contiene una API en PHP (carpeta `api/`) para CRUD (crear, leer, actualizar, borrar) de un inventario.
- Debes extraer la carpeta dentro de `C:\xampp\htdocs\inventorypro` (Windows) o `/opt/lampp/htdocs/inventorypro` (Linux).
- Inicia Apache y MySQL desde el panel de XAMPP.
- Importa `create_db.sql` en phpMyAdmin para crear la base de datos y la tabla.
- Ajusta `api/db.php` si tu usuario/contraseña son distintos.

**Pasos detallados**
1. Abre XAMPP Control Panel y arranca **Apache** y **MySQL**.
2. Extrae este ZIP en `C:\xampp\htdocs\inventorypro` (o la ruta que uses para htdocs).
3. Abre `http://localhost/phpmyadmin` y:
   - Crea una base de datos llamada `inventorydb` o importa `create_db.sql` (pestaña "Importar").
4. Revisa `api/db.php` y ajusta `$user` y `$pass` si no usas `root` sin contraseña.
5. Abre tu frontend con `http://localhost/inventorypro/index.html` (no uses file://).
6. Las rutas de la API quedan en `http://localhost/inventorypro/api/*.php`:
   - `get_items.php` (GET) → devuelve todos los items.
   - `add_item.php` (POST JSON) → agregar item.
   - `update_item.php` (POST JSON) → actualizar item (enviar id y campos a actualizar).
   - `delete_item.php` (POST JSON) → borrar item (enviar id).

**Ejemplos de llamadas desde JavaScript (fetch)**
```js
// obtener items
async function fetchItems(){
  const res = await fetch('/inventorypro/api/get_items.php');
  const items = await res.json();
  console.log(items);
  return items;
}

// agregar item
async function addItem(item){
  const res = await fetch('/inventorypro/api/add_item.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(item)
  });
  return await res.json();
}

// ejemplo de uso:
addItem({name: 'Lapicero', sku: 'LAP-01', quantity: 10, price: 1200, description: 'Azul'})
  .then(r => console.log(r));
```

**Pruebas con curl**
- GET: `curl http://localhost/inventorypro/api/get_items.php`
- POST add: `curl -X POST -H "Content-Type: application/json" -d '{"name":"Test","quantity":5}' http://localhost/inventorypro/api/add_item.php`

**Consejos y solución de problemas**
- Si `Connection failed`: revisa que MySQL esté corriendo y las credenciales en `api/db.php`.
- Si recibes errores 500: mira el log de Apache (XAMPP Control Panel → Logs → Apache).
- Si quieres restringir origenes, quita o cambia `Access-Control-Allow-Origin: *`.

---
Si quieres que también coloque estos archivos directamente dentro de tu proyecto subido (zip) y te devuelva un ZIP listo para poner en `htdocs`, dímelo y lo preparo.
