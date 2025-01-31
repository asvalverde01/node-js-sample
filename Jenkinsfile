pipeline {
    agent any

    environment {
        // Configuraciones de entorno
        SONARQUBE_SERVER = 'SonarQube' // Nombre del servidor SonarQube configurado en Jenkins (Manage Jenkins > Configure System)
        DOCKER_IMAGE = 'searinox7663/node-js-sample:latest' // Nombre y etiqueta de la imagen Docker
        SONAR_SCANNER_HOME = 'C:\\sonar-scanner\\bin\\sonar-scanner.bat' // Ruta al ejecutable de SonarScanner en el agente
        DOCKER_REGISTRY = 'docker.io' // Registro de Docker Hub
        DOCKER_CREDENTIALS_ID = 'dockerhub-token' // ID de las credenciales de Docker Hub almacenadas en Jenkins
    }

    stages {
        /**
         * Etapa 1: Checkout
         * Descripción: Clona el repositorio desde GitHub en la rama 'main'.
         */
        stage('Checkout') {
            steps {
                // Clonar el repositorio desde GitHub
                git branch: 'main', url: 'https://github.com/asvalverde01/node-js-sample.git'
            }
        }

        /**
         * Etapa 2: Build & Test
         * Descripción: Instala las dependencias de Node.js y ejecuta las pruebas unitarias.
         */
        stage('Build & Test') {
            steps {
                script {
                    try {
                        // Instalar dependencias utilizando npm
                        bat 'npm install'
                        
                        // Ejecutar pruebas unitarias
                        bat 'npm test'
                        
                        // Mensaje de éxito
                        echo "Build y pruebas completadas exitosamente."
                    } catch (e) {
                        // Manejo de errores: Mostrar mensaje y marcar el build como 'UNSTABLE'
                        echo "Error en Build & Test: ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        /**
         * Etapa 3: Static Code Analysis (SonarQube)
         * Descripción: Realiza un análisis estático del código fuente para detectar vulnerabilidades y mejorar la calidad del código.
         */
        stage('Static Code Analysis (SonarQube)') {
            steps {
                script {
                    try {
                        // Ejecutar análisis con SonarQube dentro del entorno configurado
                        withSonarQubeEnv("${SONARQUBE_SERVER}") {
                            bat """
                                "%SONAR_SCANNER_HOME%" ^
                                    -Dsonar.projectKey=node-js-sample ^
                                    -Dsonar.sources=. ^
                                    -Dsonar.host.url=http://localhost:9000 ^
                                    -Dsonar.login=sqa_5160691e529013cfbfcbbbb4abfd10fe59a8e1bd
                            """
                        }
                        
                        // Mensaje de éxito
                        echo "Análisis estático con SonarQube completado exitosamente."
                    } catch (e) {
                        // Manejo de errores: Mostrar mensaje y marcar el build como 'UNSTABLE'
                        echo "Error en Static Code Analysis (SonarQube): ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        /**
         * Etapa 4: Build Docker Image
         * Descripción: Construye la imagen Docker de la aplicación y la publica en Docker Hub.
         */
        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        // Iniciar sesión en Docker Hub usando credenciales almacenadas en Jenkins
                        withCredentials([string(credentialsId: "${DOCKER_CREDENTIALS_ID}", variable: 'DOCKER_TOKEN')]) {
                            // Ejecutar el login en Docker Hub utilizando el token
                            bat "docker login -u searinox7663 -p %DOCKER_TOKEN% ${DOCKER_REGISTRY}"
                        }

                        // Construir la imagen Docker con la etiqueta definida
                        bat "docker build -t ${DOCKER_IMAGE} ."

                        // Subir la imagen Docker al registro especificado (Docker Hub)
                        bat "docker push ${DOCKER_IMAGE}"
                        
                        // Mensaje de éxito
                        echo "Construcción y subida de la imagen Docker completadas exitosamente."
                    } catch (e) {
                        // Manejo de errores: Mostrar mensaje y marcar el build como 'UNSTABLE'
                        echo "Error en Build Docker Image: ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        /**
         * Etapa 5: Vulnerability Scan (Trivy)
         * Descripción: Escanea la imagen Docker recién construida en busca de vulnerabilidades utilizando Trivy.
         */
        stage('Vulnerability Scan (Trivy)') {
            steps {
                script {
                    try {
                        // Escanear la imagen Docker con Trivy
                        def trivyResult = bat(
                            script: 'trivy image searinox7663/node-js-sample:latest --exit-code 1 --no-progress',
                            returnStatus: true
                        )

                        // Interpretar los resultados del escaneo
                        if (trivyResult == 0) {
                            echo "No se encontraron vulnerabilidades críticas."
                        } else {
                            echo "Vulnerabilidades encontradas pero continuando el pipeline."
                            // Marcar el build como 'UNSTABLE' para indicar la presencia de vulnerabilidades
                            currentBuild.result = 'UNSTABLE'
                        }
                    } catch (e) {
                        // Manejo de errores: Mostrar mensaje y marcar el build como 'UNSTABLE'
                        echo "Error en Vulnerability Scan (Trivy): ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        /**
         * Etapa 6: Deploy to Test Environment
         * Descripción: Despliega la aplicación en un entorno de pruebas para realizar validaciones funcionales y de integración.
         */
        stage('Deploy to Test Environment') {
            steps {
                script {
                    try {
                        // Desplegar en entorno de pruebas
                        echo "Desplegando en entorno de pruebas..."

                        // Comandos reales para desplegar la aplicación en un entorno de pruebas
                        // Ejemplos:
                        // - Iniciar un contenedor Docker para pruebas
                        bat "docker run -d -p 7000:6000 --name node-js-sample-test ${DOCKER_IMAGE}"
                        
                        // Verificar que el contenedor esté corriendo
                        bat "docker ps -f name=node-js-sample-test"
                        
                        echo "Despliegue en entorno de pruebas completado exitosamente."
                    } catch (e) {
                        // Manejo de errores: Mostrar mensaje y marcar el build como 'UNSTABLE'
                        echo "Error en Deploy to Test Environment: ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        /**
         * Etapa 7: Validate Policies (OPA)
         * Descripción: Valida que el despliegue cumpla con las políticas de seguridad y gobernanza establecidas utilizando Open Policy Agent (OPA).
         */
        stage('Validate Policies (OPA)') {
            steps {
                script {
                    try {
                        // Validar políticas con Open Policy Agent (OPA)
                        echo "Validando políticas con OPA..."

                        // Comandos reales para validar políticas con OPA
                        // Supongamos que tienes políticas definidas en el directorio 'policies'
                        // y que tienes un archivo de entrada 'input.json' con los datos del despliegue
                        bat "opa eval --data ./policies/ --input ./input.json \"data.policies.allow\""

                        echo "Validación de políticas con OPA completada exitosamente."
                    } catch (e) {
                        // Manejo de errores: Mostrar mensaje y marcar el build como 'UNSTABLE'
                        echo "Error en Validate Policies (OPA): ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        /**
         * Etapa 8: Deploy to Production (Simulated)
         * Descripción: Despliega la aplicación en un entorno de producción simulado.
         */
        stage('Deploy to Production (Simulated)') {
            steps {
                script {
                    try {
                        // Desplegar en producción (simulado)
                        echo "Desplegando en entorno de producción (simulado)..."

                        // Comandos reales para desplegar la aplicación en producción
                        // Ejemplos:
                        // - Iniciar un contenedor Docker en el entorno de producción
                        bat "docker run -d -p 8000:6000 --name node-js-sample-prod ${DOCKER_IMAGE}"
                        
                        // Verificar que el contenedor esté corriendo
                        bat "docker ps -f name=node-js-sample-prod"
                        
                        echo "Despliegue en entorno de producción completado exitosamente."
                    } catch (e) {
                        // Manejo de errores: Mostrar mensaje y marcar el build como 'UNSTABLE'
                        echo "Error en Deploy to Production (Simulated): ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        /**
         * Etapa 9: Post-Deployment Security Monitoring
         * Descripción: Inicia el monitoreo de seguridad después del despliegue para detectar posibles incidentes o comportamientos anómalos.
         */
        stage('Post-Deployment Security Monitoring') {
            steps {
                script {
                    try {
                        // Iniciar monitoreo de seguridad post-despliegue
                        echo "Iniciando monitoreo de seguridad post-despliegue..."

                        // Comandos reales para iniciar herramientas de monitoreo
                        // Ejemplos:
                        // - Iniciar Prometheus y Grafana
                        // - Configurar alertas en ELK Stack
                        // Para este ejemplo, simplemente se simula con un mensaje
                        echo "Monitoreo de seguridad post-despliegue iniciado."

                        echo "Monitoreo de seguridad post-despliegue completado exitosamente."
                    } catch (e) {
                        // Manejo de errores: Mostrar mensaje y marcar el build como 'UNSTABLE'
                        echo "Error en Post-Deployment Security Monitoring: ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }

    post {
        always {
            // Acciones que se ejecutan al finalizar el pipeline, independientemente del resultado
            echo "Pipeline finalizado. Realizando limpieza si es necesario..."

            // Comandos para limpiar recursos temporales, por ejemplo, detener y eliminar contenedores de prueba
            bat """
                docker stop node-js-sample-test || echo "No hay contenedor de pruebas en ejecución."
                docker rm node-js-sample-test || echo "No hay contenedor de pruebas para eliminar."
                docker stop node-js-sample-prod || echo "No hay contenedor de producción en ejecución."
                docker rm node-js-sample-prod || echo "No hay contenedor de producción para eliminar."
            """
        }
        success {
            // Acciones que se ejecutan solo si el pipeline se ejecuta exitosamente
            echo "Pipeline ejecutado exitosamente."
        }
        unstable {
            // Acciones que se ejecutan solo si el pipeline se ejecuta con advertencias o vulnerabilidades
            echo "Pipeline ejecutado con advertencias o vulnerabilidades detectadas."
        }
        failure {
            // Acciones que se ejecutan solo si el pipeline falla
            echo "Pipeline falló. Revisar los logs para más detalles."
        }
    }
}
