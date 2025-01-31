// Importa el módulo Express
var express = require('express')
var app = express()

// Configura el puerto de la aplicación
app.set('port', (process.env.PORT || 6000))

// Middleware para registrar cada solicitud entrante
app.use(function(req, res, next) {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static(__dirname + '/public'))

// Ruta principal que renderiza una página HTML dinámica
app.get('/', function(request, response) {
  // Contenido HTML dinámico utilizando template literals
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pipeline Testing 25 Git!</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        p { font-size: 1.2em; }
        .status { margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>Pipeline Testing 25 Git!</h1>
      <p>Bienvenido a la demostración de nuestro pipeline de CI/CD con integración de DevSecOps.</p>
      <div class="status">
        <p><strong>Puerto Actual:</strong> ${app.get('port')}</p>
        <p><strong>Entorno:</strong> ${process.env.NODE_ENV || 'development'}</p>
      </div>
      <div class="api-status">
        <p><a href="/api/status">Ver Estado de la Aplicación (API)</a></p>
      </div>
    </body>
    </html>
  `;
  response.send(htmlContent)
})

// Ruta API que devuelve el estado de la aplicación en formato JSON
app.get('/api/status', function(request, response) {
  const status = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }
  response.json(status)
})

// Middleware para manejar errores
app.use(function(err, req, res, next) {
  console.error(`${new Date().toISOString()} - Error: ${err.stack}`)
  res.status(500).send('Algo salió mal!')
})

// Inicia el servidor y escucha en el puerto configurado
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
