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
                // Instalar dependencias y ejecutar pruebas
                bat 'npm install'
                bat 'npm test'
            }
        }

        stage('Static Code Analysis (SonarQube)') {
            steps {
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
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Iniciar sesión en Docker Hub usando "Secret Text"
                    withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKER_TOKEN')]) {
                        // Login usando usuario fijo y token
                        bat "docker login -u searinox7663 -p %DOCKER_TOKEN%"
                    }

                    // Construir la imagen Docker
                    bat "docker build -t %DOCKER_IMAGE% ."

                    // Subir la imagen a Docker Hub
                    bat "docker push %DOCKER_IMAGE%"
                }
            }
        }

        stage('Vulnerability Scan (Trivy)') {
            steps {
                // Escanear la imagen Docker con Trivy
                bat "trivy image %DOCKER_IMAGE% --exit-code 0 || echo Vulnerabilidades encontradas pero continuando"
            }
        }

        stage('Deploy to Test Environment') {
            steps {
                // Desplegar en entorno de pruebas (simulado)
                echo "Desplegando en entorno de pruebas (simulado)..."
            }
        }

        stage('Validate Policies (OPA)') {
            steps {
                // Validar políticas con Open Policy Agent (simulado)
                echo "Validando políticas con OPA (simulado)..."
            }
        }

        stage('Deploy to Production (Simulated)') {
            steps {
                // Desplegar en producción (simulado)
                echo "Desplegando en producción (simulado)..."
            }
        }
    }

    post {
        always {
            echo "Pipeline finalizado. Realizando limpieza si es necesario..."
        }
    }
}
