---
trigger: always_on
---

# BackEnd Master Template: [Entity]

Complete, unabridged code for the Backend layer. Replace `[Entity]` with PascalCase and `[entity]` with camelCase/snake_case as needed. Use `[entities]` for plural forms.

---

## 🟦 Master Controller: `[Entity]Controller.php`

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\[Entity];
use App\Http\Requests\[Entity]\Registrar[Entity]Request;
use App\Http\Requests\[Entity]\Actualizar[Entity]Request;
use Illuminate\Http\Request;

class [Entity]Controller extends Controller
{
    /**
     * REGISTRAR UN NUEVO [ENTITY]
     */
    public function registrar[Entity](Registrar[Entity]Request $request)
    {
        // Crear un nuevo registro con los datos validados
        [Entity]::create($request->all());

        return response()->json([
            'success' => true,
            'message' => '[Entity] registrado correctamente',
        ]);
    }

    /**
     * LISTAR TODOS LOS [ENTITY] CON FILTROS Y PAGINACIÓN
     */
    public function listar[Entity](Request $request)
    {
        //* Validación de parámetros de entrada
        $validated = $request->validate([
            //* Filtros de paginado
            'per_page' => 'sometimes|integer|min:1|max:100',
            'page' => 'sometimes|integer|min:1',

            //* Filtro de búsqueda global
            'search' => 'sometimes|string|max:255',

            //* Filtros adicionales (Ejemplos)
            // 'estado' => 'sometimes|string',
            // 'categoria' => 'sometimes|integer',
        ]);

        //* Filtros con valores por defecto
        $termino = $validated['search'] ?? '';
        $perPage = $validated['per_page'] ?? 10;
        $page = $validated['page'] ?? 1;

        //! CONSULTA BASE CON RELACIONES Y ORDENAMIENTO
        // Agregue relaciones en with() si es necesario
        $query = [Entity]::with([])->orderBy('created_at', 'desc');

        //* Aplicar filtro de búsqueda global
        if (!empty($termino)) {
            $query->where(function ($q) use ($termino) {
                // La IA debe razonar y seleccionar los campos más importantes para la búsqueda
                // IMPORTANTE: Seleccionar los 2-3 campos más relevantes para la búsqueda 
                // y SINCRONIZARLOS con el placeholder del input en el Frontend.
                $q->where('campo_1', 'LIKE', "%{$termino}%")
                    ->orWhere('campo_2', 'LIKE', "%{$termino}%")
                    ->orWhere('campo_3', 'LIKE', "%{$termino}%");
            });
        }

        //* Ejecutar la consulta con paginación optimizada
        $[entities]Data = $query->paginate($perPage, ['*'], 'page', $page);

        //* Respuesta exitosa estandarizada
        return response()->json([
            'success' => true,
            'message' => 'Listado de [Entity] generado',
            'data' => $[entities]Data->items(),
            'pagination' => [
                'current_page' => $[entities]Data->currentPage(),
                'last_page' => $[entities]Data->lastPage(),
                'per_page' => $[entities]Data->perPage(),
                'total' => $[entities]Data->total(),
                'from' => $[entities]Data->firstItem(),
                'to' => $[entities]Data->lastItem(),
                'has_more_pages' => $[entities]Data->hasMorePages(),
                'prev_page_url' => $[entities]Data->previousPageUrl(),
                'next_page_url' => $[entities]Data->nextPageUrl()
            ],
            'filters_aplicados' => [
                'search' => $termino,
            ]
        ], 200);
    }

    /**
     * ACTUALIZAR UN [ENTITY] EXISTENTE
     */
    public function actualizar[Entity](Actualizar[Entity]Request $request, [Entity] $id_[entity])
    {
        // Actualizar con los datos validados
        $id_[entity]->update($request->all());

        return response()->json([
            'success' => true,
            'message' => '[Entity] actualizado correctamente',
        ]);
    }

    /**
     * ELIMINAR UN [ENTITY]
     */
    public function eliminar[Entity]([Entity] $id_[entity])
    {
        // Eliminar el registro
        $id_[entity]->delete();

        return response()->json([
            'success' => true,
            'message' => '[Entity] eliminado correctamente'
        ]);
    }
}
```

---

## 🟦 Master Model: `[Entity].php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class [Entity] extends Model
{
    // Nombre de la tabla en base de datos
    protected $table = "[entities]";

    // Clave primaria de la tabla
    protected $primaryKey = "id_[entity]";

    // Campos que se pueden registrar masivamente
    protected $fillable = [
        "id_[entity]",
        // "id_referencia",
        "descripcion",
        "monto",
        "fecha_[entity]",
        // Agregue más campos según el modelo
        "created_at",
        "updated_at",
    ];

    // Campos ocultos en las respuestas JSON
    protected $hidden = [];

    // Relaciones (Ejemplos)
    /*
    public function [relation]()
    {
        return $this->hasMany([Model]::class, 'id_[entity]', 'id_[entity]');
    }
    */
}
```

---

## 🟦 Master Form Request: `Registrar[Entity]Request.php`

```php
<?php

namespace App\Http\Requests\[Entity];

use Illuminate\Foundation\Http\FormRequest;

class Registrar[Entity]Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "descripcion" => "required|string|max:255",
            "monto" => "required|numeric|min:0",
            "fecha_[entity]" => "required|date",
            // Agregue más reglas aquí
        ];
    }

    public function messages(): array
    {
        return [
            "descripcion.required" => "La descripción es obligatoria.",
            "monto.required" => "El monto es obligatorio.",
            "fecha_[entity].required" => "La fecha es obligatoria.",
        ];
    }
}
```

---

## 🟦 Master Form Request: `Actualizar[Entity]Request.php`

```php
<?php

namespace App\Http\Requests\[Entity];

use Illuminate\Foundation\Http\FormRequest;

class Actualizar[Entity]Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "descripcion" => "sometimes|string|max:255",
            "monto" => "sometimes|numeric|min:0",
            "fecha_[entity]" => "sometimes|date",
            // Agregue más reglas aquí
        ];
    }

    public function messages(): array
    {
        return [
            "descripcion.max" => "La descripción no debe superar los 255 caracteres.",
        ];
    }
}
```

---

## 🟦 Master Route: `api.php`

```php
Route::controller([Entity]Controller::class)
    ->prefix('[entities-kebab-case]') // ej: gastos-fijos
    ->group(function () {
        Route::post('/registrar[Entity]', 'registrar[Entity]');
        Route::get('/listar[Entities]', 'listar[Entities]');
        Route::patch('/actualizar[Entity]/{id_[entity]}', 'actualizar[Entity]');
        Route::delete('/eliminar[Entity]/{id_[entity]}', 'eliminar[Entity]');
    });
```
