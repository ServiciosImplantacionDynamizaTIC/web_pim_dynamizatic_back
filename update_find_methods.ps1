# PowerShell script to update find methods in all controllers

$controllerMappings = @{
    "auditoria.controller.ts" = @{model="Auditoria"; table="auditoria"}
    "calendarios-disponibilidad.controller.ts" = @{model="CalendariosDisponibilidad"; table="calendarios_disponibilidad"}
    "campo-dinamico.controller.ts" = @{model="CampoDinamico"; table="campo_dinamico"}
    "catalogo-producto.controller.ts" = @{model="CatalogoProducto"; table="catalogo_producto"}
    "catalogo.controller.ts" = @{model="Catalogo"; table="catalogo"}
    "categoria-grupo-atributo.controller.ts" = @{model="CategoriaGrupoAtributo"; table="categoria_grupo_atributo"}
    "configuracion-diseno.controller.ts" = @{model="ConfiguracionDiseno"; table="configuracion_diseno"}
    "grupo-atributo.controller.ts" = @{model="GrupoAtributo"; table="grupo_atributo"}
    "icono.controller.ts" = @{model="Icono"; table="icono"}
    "marca.controller.ts" = @{model="Marca"; table="marca"}
    "marketplace.controller.ts" = @{model="Marketplace"; table="marketplace"}
    "multimedia.controller.ts" = @{model="Multimedia"; table="multimedia"}
    "log-acceso.controller.ts" = @{model="LogAcceso"; table="log_acceso"}
    "log-exportacion.controller.ts" = @{model="LogExportacion"; table="log_exportacion"}
    "log-importacion.controller.ts" = @{model="LogImportacion"; table="log_importacion"}
    "log-sincronizacion.controller.ts" = @{model="LogSincronizacion"; table="log_sincronizacion"}
    "log-usuario.controller.ts" = @{model="LogUsuario"; table="log_usuario"}
    "mensaje-plantilla-categoria.controller.ts" = @{model="MensajePlantillaCategoria"; table="mensaje_plantilla_categoria"}
    "mensaje-tipo.controller.ts" = @{model="MensajeTipo"; table="mensaje_tipo"}
    "notificacion.controller.ts" = @{model="Notificacion"; table="notificacion"}
    "parametro-global.controller.ts" = @{model="ParametroGlobal"; table="parametro_global"}
    "plantilla-email.controller.ts" = @{model="PlantillaEmail"; table="plantilla_email"}
    "producto-atributo.controller.ts" = @{model="ProductoAtributo"; table="producto_atributo"}
    "producto-campo-dinamico.controller.ts" = @{model="ProductoCampoDinamico"; table="producto_campo_dinamico"}
    "producto-icono.controller.ts" = @{model="ProductoIcono"; table="producto_icono"}
    "producto-marketplace.controller.ts" = @{model="ProductoMarketplace"; table="producto_marketplace"}
    "producto-multimedia.controller.ts" = @{model="ProductoMultimedia"; table="producto_multimedia"}
    "refrescar-token.controller.ts" = @{model="RefrescarToken"; table="refrescar_token"}
    "tarea.controller.ts" = @{model="Tarea"; table="tarea"}
    "tipo-archivo.controller.ts" = @{model="TipoArchivo"; table="tipo_archivo"}
    "tipo-usuario-usuario.controller.ts" = @{model="TipoUsuarioUsuario"; table="tipo_usuario_usuario"}
    "tipo-usuario.controller.ts" = @{model="TipoUsuario"; table="tipo_usuario"}
    "traduccion-contenido.controller.ts" = @{model="TraduccionContenido"; table="traduccion_contenido"}
    "traduccion-literal.controller.ts" = @{model="TraduccionLiteral"; table="traduccion_literal"}
    "traduccion.controller.ts" = @{model="Traduccion"; table="traduccion"}
    "usuario-credenciales.controller.ts" = @{model="UsuarioCredenciales"; table="usuario_credenciales"}
}

$baseDir = "c:\xampp\htdocs\pim_DYNAMIZATIC\pim_dynamizatic_back\src\controllers"

Write-Host "Updating find methods in controllers..."

foreach ($fileName in $controllerMappings.Keys) {
    $filePath = Join-Path $baseDir $fileName
    $mapping = $controllerMappings[$fileName]
    
    if (Test-Path $filePath) {
        Write-Host "Processing $fileName..."
        
        $content = Get-Content $filePath -Raw
        
        # Pattern to match the simple find method
        $findPattern = "return this\.\w+Repository\.find\(filter\);"
        
        if ($content -match $findPattern) {
            Write-Host "Found find pattern in $fileName, updating..."
            
            # Create the replacement logic for the find method
            $newFindLogic = @"
const dataSource = this.*Repository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += `` WHERE 1=1``
    if (filter?.where) {
      for (const [key] of Object.entries(filter?.where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((filter?.where as any)[key])) {
              if (subValue !== '' && subValue != null) {
                if (!first) {
                  if (key === 'and') {
                    filtros += `` AND``;
                  }
                  else {
                    filtros += `` OR``;
                  }
                }
                else {
                  filtros += ' AND ('
                }
                if (/^-?\d+(\.\d+)?$/.test(subValue as string)) {
                  filtros += `` `${subKey} = `${subValue}``;
                }
                else {
                  filtros += `` `${subKey} LIKE '%`${subValue}%'``;
                }
                first = false
              }
            }
            if (!first) {
              filtros += ``)`;
            }
          }
        }

      }
    }
    // Agregar ordenamiento
    if (filter?.order) {
      filtros += `` ORDER BY `${filter.order}``;
    }
    // Agregar paginación
    if (filter?.limit) {
      filtros += `` LIMIT `${filter?.limit}``;
    }
    if (filter?.offset) {
      filtros += `` OFFSET `${filter?.offset}``;
    }
    const query = ``SELECT * FROM $($mapping.table)`${filtros}``;
    const registros = await dataSource.execute(query);
    return registros;
"@
            
            $updatedContent = $content -replace [regex]::Escape($findPattern), $newFindLogic
            Set-Content -Path $filePath -Value $updatedContent -Encoding UTF8
            Write-Host "Updated $fileName"
        } else {
            Write-Host "Find pattern not found in $fileName - may already be updated"
        }
    } else {
        Write-Host "File not found: $fileName"
    }
}

Write-Host "All find methods processed!"