pipeline {
    agent any

    environment {
        // Línea 1: Define la variable que apunta al servidor SonarQube configurado en Jenkins.
        SONARQUBE_SERVER = 'SonarQube'
        // Línea 2: Nombre e imagen Docker que vas a compilar y subir a Docker Hub.
        DOCKER_IMAGE = 'searinox7663/node-js-sample:latest'
        // Línea 3: Ruta completa al ejecutable de sonar-scanner para Windows (asegúrate de que exista).
        // Se usan dobles barras invertidas para escapar correctamente en Windows.
        SONAR_SCANNER_HOME = 'C:\\\\sonar-scanner\\\\bin\\\\sonar-scanner.bat'
    }

    stages {
        // Línea 4: Etapa para clonar el repositorio Git (rama master).
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/asvalverde01/node-js-sample.git'
            }
        }

        // Línea 5: Etapa de Build & Test con npm en Windows (usa 'bat').
        stage('Build & Test') {
            steps {
                bat 'npm install'
                bat 'npm test'
            }
        }

        // Línea 6: Etapa de Análisis estático con SonarQube.
        stage('Static Code Analysis (SonarQube)') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    // Importante: Se utiliza ^ para continuar líneas en Windows y dobles barras en la ruta.
                    // Asegúrate de que "C:\\sonar-scanner\\bin\\sonar-scanner.bat" exista de verdad.
                    bat """
                        "%SONAR_SCANNER_HOME%" ^
                            -Dsonar.projectKey=node-js-sample ^
                            -Dsonar.sources=. ^
                            -Dsonar.host.url=http://localhost:9000 ^
                            -Dsonar.login=sqa_5160691e529013cfbfcbbbb4abfd10fe59a8e1bd
                    """
                }
            }
        }

        // Línea 7: Etapa para construir y subir la imagen Docker.
        stage('Build Docker Image') {
            steps {
                script {
                    // Autenticación en Docker Hub con credenciales definidas en Jenkins.
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
                    }
                    bat "docker build -t %DOCKER_IMAGE% ."
                    bat "docker push %DOCKER_IMAGE%"
                }
            }
        }

        // Línea 8: Etapa de escaneo de vulnerabilidades con Trivy.
        stage('Vulnerability Scan (Trivy)') {
            steps {
                // Requiere que Trivy esté instalado y en el PATH de Windows.
                bat "trivy image %DOCKER_IMAGE% --exit-code 0 || echo Vulnerabilidades encontradas pero continuando"
            }
        }

        // Línea 9: Etapa de despliegue en entorno de pruebas (simulado).
        stage('Deploy to Test Environment') {
            steps {
                echo "Desplegando en entorno de pruebas (simulado)..."
            }
        }

        // Línea 10: Etapa de validación de políticas con OPA (simulado).
        stage('Validate Policies (OPA)') {
            steps {
                echo "Validando políticas con OPA (simulado)..."
            }
        }

        // Línea 11: Etapa de despliegue a producción (simulado).
        stage('Deploy to Production (Simulated)') {
            steps {
                echo "Desplegando en producción (simulado)..."
            }
        }
    }

    // Línea 12: Bloque final para mensajes o limpiezas, siempre se ejecuta.
    post {
        always {
            echo "Pipeline finalizado. Realizando limpieza si es necesario..."
        }
    }
}
