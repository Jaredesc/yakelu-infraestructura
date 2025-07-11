# YAKELU INFRAESTRUCTURA - Sitio Web Corporativo

> "Nuestro compromiso su satisfacción"

## 📋 Descripción del Proyecto

Sitio web corporativo moderno y responsivo para **YAKELU INFRAESTRUCTURA S. DE R.L. DE C.V.**, empresa mexicana de construcción e ingeniería con sede en Zacatecas.

### 🎯 Características Principales

- ✅ **Diseño 100% Responsivo** - Compatible con móviles, tablets y desktop
- ✅ **Optimizado para SEO** - Meta tags, estructura semántica y performance
- ✅ **Formulario de Contacto Funcional** - Validación en tiempo real
- ✅ **Animaciones Profesionales** - Efectos suaves y modernos
- ✅ **Navegación Intuitiva** - Menú fijo y desplazamiento suave
- ✅ **Carga Rápida** - Código optimizado y assets comprimidos

---

## 📁 Estructura del Proyecto

```
yakelu-infraestructura/
├── index.html                 # Página principal
├── assets/
│   ├── css/
│   │   ├── style.css          # Estilos principales
│   │   └── responsive.css     # Estilos responsivos
│   ├── js/
│   │   ├── main.js           # JavaScript principal
│   │   └── animations.js     # Animaciones y efectos
│   └── images/
│       ├── logo/
│       │   ├── logo.svg      # Logo principal
│       │   └── favicon.ico   # Icono del sitio
│       ├── gallery/          # Imágenes de proyectos
│       └── icons/            # Iconos adicionales
├── docs/
│   └── presentacion-corporativa.pdf
└── README.md                 # Esta documentación
```

---

## 🚀 Instalación y Configuración

### 1. Descarga los Archivos
```bash
# Crear carpeta del proyecto
mkdir yakelu-infraestructura
cd yakelu-infraestructura

# Descargar archivos (copiar el contenido de cada artifact)
```

### 2. Configuración de Hosting

#### Opción A: Hosting Tradicional (Recomendado)
```bash
# Subir todos los archivos vía FTP/cPanel
# Estructura en el servidor:
public_html/
├── index.html
├── assets/
└── docs/
```

#### Opción B: GitHub Pages (Gratis)
```bash
# Crear repositorio en GitHub
git init
git add .
git commit -m "Initial commit - YAKELU Website"
git remote add origin [URL-DEL-REPO]
git push -u origin main

# Activar GitHub Pages en la configuración del repo
```

### 3. Configuración del Dominio
- Apuntar el dominio a la IP del hosting
- Configurar SSL (HTTPS)
- Verificar que todos los archivos cargan correctamente

---

## 🛠️ Personalización

### Cambiar Información de Contacto

**Archivo:** `index.html`
```html
<!-- Buscar sección contact-info y modificar -->
<div class="contact-item">
    <div class="contact-icon">📞</div>
    <div>
        <strong>Teléfonos:</strong><br>
        +52 492 900 82 26<br>  <!-- CAMBIAR AQUÍ -->
        +52 492 111 47 71      <!-- CAMBIAR AQUÍ -->
    </div>
</div>
```

### Cambiar Colores Corporativos

**Archivo:** `assets/css/style.css`
```css
:root {
    --primary-color: #2d5a6b;     /* Color principal */
    --secondary-color: #e67e22;   /* Color naranja */
    --accent-color: #34495e;      /* Color de acento */
    --light-gray: #f8f9fa;        /* Gris claro */
    --text-dark: #2c3e50;         /* Texto oscuro */
}
```

### Agregar Nuevos Servicios

**Archivo:** `index.html`
```html
<!-- Agregar dentro de .services-grid -->
<div class="service-card">
    <div class="service-icon">🔧</div>
    <h3>Nuevo Servicio</h3>
    <p>Descripción del nuevo servicio...</p>
</div>
```

### Modificar Redes Sociales

**Archivo:** `index.html`
```html
<!-- Buscar .social-links y cambiar URLs -->
<div class="social-links">
    <a href="https://facebook.com/yakelu" target="_blank">📘</a>
    <a href="https://instagram.com/yakelu" target="_blank">📸</a>
    <!-- Agregar más redes -->
</div>
```

---

## 📧 Configuración del Formulario

### Opción 1: Formspree (Recomendado - Gratis)
```html
<!-- Cambiar en index.html -->
<form id="contactForm" action="https://formspree.io/f/TU_ID_AQUI" method="POST">
```

### Opción 2: EmailJS (JavaScript)
```javascript
// Agregar en assets/js/main.js
// Configurar según documentación de EmailJS
```

### Opción 3: Backend PHP (Avanzado)
```php
// Crear archivo contact.php en el servidor
// Configurar envío de emails
```

---

## 🎨 Optimización y SEO

### Meta Tags Importantes
```html
<meta name="description" content="YAKELU INFRAESTRUCTURA - Empresa mexicana de construcción e ingeniería">
<meta name="keywords" content="construcción, infraestructura, ingeniería, Zacatecas, México">
<meta property="og:title" content="YAKELU INFRAESTRUCTURA">
<meta property="og:image" content="assets/images/logo/og-image.jpg">
```

### Google Analytics
```html
<!-- Agregar antes del </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Optimización de Velocidad
- ✅ Imágenes comprimidas (WebP recomendado)
- ✅ CSS y JS minificados
- ✅ Lazy loading implementado
- ✅ Cache del navegador configurado

---

## 📱 Breakpoints Responsivos

| Dispositivo | Ancho | CSS Media Query |
|-------------|-------|-----------------|
| Móvil Pequeño | 320px - 480px | `@media (max-width: 480px)` |
| Móvil Grande | 481px - 768px | `@media (max-width: 768px)` |
| Tablet | 769px - 1024px | `@media (max-width: 1024px)` |
| Desktop | 1025px+ | Estilos base |

---

## 🔧 Mantenimiento

### Actualizaciones Regulares
1. **Información de contacto** - Verificar teléfonos y emails
2. **Proyectos completados** - Agregar nuevas obras
3. **Certificaciones** - Mantener registros actualizados
4. **Testimonios** - Agregar reseñas de clientes

### Backup y Seguridad
```bash
# Backup semanal recomendado
cp -r yakelu-infraestructura/ backup-$(date +%Y%m%d)/

# Verificar SSL y certificados
# Mantener plugins/themes actualizados si usas CMS
```

### Monitoreo de Performance
- **Google PageSpeed Insights** - Verificar velocidad
- **Google Search Console** - Monitorear SEO
- **Google Analytics** - Analizar tráfico

---

## 🐛 Solución de Problemas

### Problemas Comunes

**1. El menú móvil no funciona**
```javascript
// Verificar que main.js está cargando correctamente
console.log('Main JS loaded');
```

**2. Las animaciones no se ven**
```css
/* Verificar que animations.js está incluido */
/* Revisar prefers-reduced-motion */
```

**3. El formulario no envía**
```html
<!-- Verificar action del form -->
<!-- Revisar configuración de Formspree/EmailJS -->
```

**4. Problemas de responsive**
```html
<!-- Verificar viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 📞 Soporte Técnico

### Contacto para Actualizaciones
- **Desarrollador:** [Tu Nombre]
- **Email:** [tu@email.com]
- **Teléfono:** [Tu Teléfono]

### Documentación Técnica
- **Tecnologías:** HTML5, CSS3, JavaScript Vanilla
- **Compatibilidad:** IE11+, Chrome, Firefox, Safari, Edge
- **Framework CSS:** Custom (no dependencies)
- **Hosting Recomendado:** Hostinger, GoDaddy, Bluehost

---

## 📄 Licencia y Créditos

**Desarrollado para:** YAKELU INFRAESTRUCTURA S. DE R.L. DE C.V.  
**RFC:** YIN2106248X9  
**Ubicación:** Francisco I. Madero 206 Ote., Centro, Calera, Zac. 98500  

**Derechos de Autor:** © 2024 YAKELU INFRAESTRUCTURA  
**Desarrollador Web:** [Tu Nombre/Empresa]

---

## ✅ Checklist de Lanzamiento

- [ ] Todos los archivos subidos al servidor
- [ ] Dominio configurado y funcionando
- [ ] SSL/HTTPS activo
- [ ] Formulario de contacto probado
- [ ] Navegación móvil funcionando
- [ ] Velocidad de carga < 3 segundos
- [ ] Google Analytics configurado
- [ ] Meta tags completados
- [ ] Información de contacto verificada
- [ ] Backup inicial realizado

---

**¡Sitio web listo para usar! 🚀**

Para cualquier duda o actualización, contactar al desarrollador.