pipeline {
    agent any

    environment {
        // Configuraciones de entorno
        SONARQUBE_SERVER = 'SonarQube' // Nombre configurado en Manage Jenkins > Configure System
        DOCKER_IMAGE = 'searinox7663/node-js-sample:latest' // Cambiar según tu imagen de Docker
        SONAR_SCANNER_HOME = 'C:\\sonar-scanner\\bin\\sonar-scanner.bat' // Ruta a sonar-scanner.bat
    }

    stages {
        stage('Checkout') {
            steps {
                // Clonar el repositorio desde Git
                git branch: 'master', url: 'https://github.com/asvalverde01/node-js-sample.git'
            }
        }

        stage('Build & Test') {
            steps {
                script {
                    try {
                        // Instalar dependencias
                        bat 'npm install'
                        // Ejecutar pruebas
                        bat 'npm test'
                        echo "Build y pruebas completadas exitosamente."
                    } catch (e) {
                        echo "Error en Build & Test: ${e}"
                        // Opcional: marcar build como UNSTABLE
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Static Code Analysis (SonarQube)') {
            steps {
                script {
                    try {
                        // Ejecutar análisis con SonarQube
                        withSonarQubeEnv("${SONARQUBE_SERVER}") {
                            bat """
                                "%SONAR_SCANNER_HOME%" ^
                                    -Dsonar.projectKey=node-js-sample ^
                                    -Dsonar.sources=. ^
                                    -Dsonar.host.url=http://localhost:9000 ^
                                    -Dsonar.login=sqa_5160691e529013cfbfcbbbb4abfd10fe59a8e1bd
                            """
                        }
                        echo "Análisis estático con SonarQube completado exitosamente."
                    } catch (e) {
                        echo "Error en Static Code Analysis (SonarQube): ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        // Iniciar sesión en Docker Hub usando "Secret Text"
                        withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKER_TOKEN')]) {
                            // Ejecutar el login usando el token directamente
                            bat "docker login -u searinox7663 -p %DOCKER_TOKEN%"
                        }

                        // Construir la imagen Docker
                        bat "docker build -t %DOCKER_IMAGE% ."

                        // Subir la imagen a Docker Hub
                        bat "docker push %DOCKER_IMAGE%"
                        echo "Construcción y subida de la imagen Docker completadas exitosamente."
                    } catch (e) {
                        echo "Error en Build Docker Image: ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Vulnerability Scan (Trivy)') {
            steps {
                script {
                    try {
                        // Escanear la imagen Docker con Trivy
                        def trivyResult = bat(
                            script: 'trivy image searinox7663/node-js-sample:latest --exit-code 1 --no-progress',
                            returnStatus: true
                        )

                        if (trivyResult == 0) {
                            echo "No se encontraron vulnerabilidades críticas."
                        } else {
                            echo "Vulnerabilidades encontradas pero continuando el pipeline."
                            // Opcional: marcar build como UNSTABLE
                            currentBuild.result = 'UNSTABLE'
                        }
                    } catch (e) {
                        echo "Error en Vulnerability Scan (Trivy): ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Deploy to Test Environment') {
            steps {
                script {
                    try {
                        // Desplegar en entorno de pruebas (simulado)
                        echo "Desplegando en entorno de pruebas (simulado)..."
                        // Aquí puedes agregar comandos reales para desplegar la aplicación en un entorno de pruebas
                    } catch (e) {
                        echo "Error en Deploy to Test Environment: ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Validate Policies (OPA)') {
            steps {
                script {
                    try {
                        // Validar políticas con Open Policy Agent (simulado)
                        echo "Validando políticas con OPA (simulado)..."
                        // Aquí puedes integrar OPA para validar políticas de seguridad y despliegue
                    } catch (e) {
                        echo "Error en Validate Policies (OPA): ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Deploy to Production (Simulated)') {
            steps {
                script {
                    try {
                        // Desplegar en producción (simulado)
                        echo "Desplegando en producción (simulado)..."
                        // Aquí puedes agregar comandos reales para desplegar la aplicación en producción
                    } catch (e) {
                        echo "Error en Deploy to Production (Simulated): ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Post-Deployment Security Monitoring') {
            steps {
                script {
                    try {
                        // Monitoreo de seguridad post-despliegue (simulado)
                        echo "Iniciando monitoreo de seguridad post-despliegue..."
                        // Aquí puedes integrar herramientas de monitoreo como Prometheus, Grafana, ELK Stack, etc.
                    } catch (e) {
                        echo "Error en Post-Deployment Security Monitoring: ${e}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finalizado. Realizando limpieza si es necesario..."
            // Aquí puedes agregar pasos para limpiar recursos temporales, notificaciones, etc.
        }
        success {
            echo "Pipeline ejecutado exitosamente."
        }
        unstable {
            echo "Pipeline ejecutado con advertencias o vulnerabilidades detectadas."
        }
        failure {
            echo "Pipeline falló. Revisar los logs para más detalles."
        }
    }
}
