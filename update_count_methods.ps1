# PowerShell script to update count methods in all controllers

$controllerMappings = @{
    "configuracion-diseno.controller.ts" = @{model="ConfiguracionDiseno"; table="configuracion_diseno"; repo="configuracionDiseno"}
    "grupo-atributo.controller.ts" = @{model="GrupoAtributo"; table="grupo_atributo"; repo="grupoAtributo"}
    "icono.controller.ts" = @{model="Icono"; table="icono"; repo="icono"}
    "idioma.controller.ts" = @{model="Idioma"; table="idioma"; repo="idioma"}
    "log-acceso.controller.ts" = @{model="LogAcceso"; table="log_acceso"; repo="logAcceso"}
    "log-exportacion.controller.ts" = @{model="LogExportacion"; table="log_exportacion"; repo="logExportacion"}
    "log-importacion.controller.ts" = @{model="LogImportacion"; table="log_importacion"; repo="logImportacion"}
    "log-sincronizacion.controller.ts" = @{model="LogSincronizacion"; table="log_sincronizacion"; repo="logSincronizacion"}
    "log-usuario.controller.ts" = @{model="LogUsuario"; table="log_usuario"; repo="logUsuario"}
    "marca.controller.ts" = @{model="Marca"; table="marca"; repo="marca"}
    "marketplace.controller.ts" = @{model="Marketplace"; table="marketplace"; repo="marketplace"}
    "mensaje-plantilla-categoria.controller.ts" = @{model="MensajePlantillaCategoria"; table="mensaje_plantilla_categoria"; repo="mensajePlantillaCategoria"}
    "mensaje-plantilla.controller.ts" = @{model="MensajePlantilla"; table="mensaje_plantilla"; repo="mensajePlantilla"}
    "mensaje-tipo.controller.ts" = @{model="MensajeTipo"; table="mensaje_tipo"; repo="mensajeTipo"}
    "multimedia.controller.ts" = @{model="Multimedia"; table="multimedia"; repo="multimedia"}
    "notificacion.controller.ts" = @{model="Notificacion"; table="notificacion"; repo="notificacion"}
    "parametro-global.controller.ts" = @{model="ParametroGlobal"; table="parametro_global"; repo="parametroGlobal"}
    "permiso.controller.ts" = @{model="Permiso"; table="permiso"; repo="permiso"}
    "plantilla-email.controller.ts" = @{model="PlantillaEmail"; table="plantilla_email"; repo="plantillaEmail"}
    "producto-atributo.controller.ts" = @{model="ProductoAtributo"; table="producto_atributo"; repo="productoAtributo"}
    "producto-campo-dinamico.controller.ts" = @{model="ProductoCampoDinamico"; table="producto_campo_dinamico"; repo="productoCampoDinamico"}
    "producto-icono.controller.ts" = @{model="ProductoIcono"; table="producto_icono"; repo="productoIcono"}
    "producto-marketplace.controller.ts" = @{model="ProductoMarketplace"; table="producto_marketplace"; repo="productoMarketplace"}
    "producto-multimedia.controller.ts" = @{model="ProductoMultimedia"; table="producto_multimedia"; repo="productoMultimedia"}
    "refrescar-token.controller.ts" = @{model="RefrescarToken"; table="refrescar_token"; repo="refrescarToken"}
    "rol.controller.ts" = @{model="Rol"; table="rol"; repo="rol"}
    "tarea.controller.ts" = @{model="Tarea"; table="tarea"; repo="tarea"}
    "tipo-archivo.controller.ts" = @{model="TipoArchivo"; table="tipo_archivo"; repo="tipoArchivo"}
    "tipo-usuario-usuario.controller.ts" = @{model="TipoUsuarioUsuario"; table="tipo_usuario_usuario"; repo="tipoUsuarioUsuario"}
    "tipo-usuario.controller.ts" = @{model="TipoUsuario"; table="tipo_usuario"; repo="tipoUsuario"}
    "traduccion-contenido.controller.ts" = @{model="TraduccionContenido"; table="traduccion_contenido"; repo="traduccionContenido"}
    "traduccion-literal.controller.ts" = @{model="TraduccionLiteral"; table="traduccion_literal"; repo="traduccionLiteral"}
    "traduccion.controller.ts" = @{model="Traduccion"; table="traduccion"; repo="traduccion"}
    "usuario-credenciales.controller.ts" = @{model="UsuarioCredenciales"; table="usuario_credenciales"; repo="usuarioCredenciales"}
    "usuario-password-historico.controller.ts" = @{model="UsuarioPasswordHistorico"; table="usuario_password_historico"; repo="usuarioPasswordHistorico"}
}

$baseDir = "c:\xampp\htdocs\pim_DYNAMIZATIC\pim_dynamizatic_back\src\controllers"

foreach ($fileName in $controllerMappings.Keys) {
    $filePath = Join-Path $baseDir $fileName
    $mapping = $controllerMappings[$fileName]
    
    if (Test-Path $filePath) {
        Write-Host "Processing $fileName..."
        
        $content = Get-Content $filePath -Raw
        
        # Pattern to match the simple count method
        $pattern = "return this\.$($mapping.repo)Repository\.count\(where\);"
        
        if ($content -match $pattern) {
            # Create the replacement
            $newMethod = @"
    const dataSource = this.$($mapping.repo)Repository.dataSource;
    //Aplicamos filtros
    let filtros = '';
    //Obtiene los filtros
    filtros += `` WHERE 1=1``
    if (where) {
      for (const [key] of Object.entries(where)) {
        if (key === 'and' || key === 'or') {
          {
            let first = true
            for (const [subKey, subValue] of Object.entries((where as any)[key])) {
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
    const query = ``SELECT COUNT(*) AS count FROM $($mapping.table)`${filtros}``;
    const registros = await dataSource.execute(query, []);
    return registros[0];
"@
            
            $updatedContent = $content -replace [regex]::Escape($pattern), $newMethod
            Set-Content -Path $filePath -Value $updatedContent -Encoding UTF8
            Write-Host "Updated $fileName"
        } else {
            Write-Host "Pattern not found in $fileName"
        }
    } else {
        Write-Host "File not found: $fileName"
    }
}

Write-Host "All files processed!"