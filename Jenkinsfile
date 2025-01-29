pipeline {
    agent any

    environment {
        // Configuraciones de entorno
        SONARQUBE_SERVER = 'SonarQube' // Nombre configurado en Manage Jenkins > Configure System
        DOCKER_IMAGE = 'searinox7663/node-js-sample:latest' // Cambiar según tu imagen de Docker
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
                        sonar-scanner ^
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
                    // Iniciar sesión en Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
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
                // Nota: El operador '||' en Windows puede requerir manejo adicional dependiendo de tu versión de Trivy
            }
        }

        stage('Deploy to Test Environment') {
            steps {
                // Desplegar en entorno de pruebas (simulado)
                echo "Desplegando en entorno de pruebas (simulado)..."
                // Aquí puedes agregar comandos para desplegar, por ejemplo:
                // bat 'docker run -d -p 5000:5000 %DOCKER_IMAGE%'
            }
        }

        stage('Validate Policies (OPA)') {
            steps {
                // Validar políticas con Open Policy Agent (simulado)
                echo "Validando políticas con OPA (simulado)..."
                // Agrega comandos reales si tienes políticas definidas
                // bat 'opa eval --data ./policies/ --input ./input.json "data.policy.allow"'
            }
        }

        stage('Deploy to Production (Simulated)') {
            steps {
                // Desplegar en producción (simulado)
                echo "Desplegando en producción (simulado)..."
                // Agrega comandos reales para despliegue si es necesario
                // bat 'docker run -d -p 80:5000 %DOCKER_IMAGE%'
            }
        }
    }

    post {
        always {
            echo "Pipeline finalizado. Realizando limpieza si es necesario..."
            // Agrega pasos de limpieza si es necesario
        }
    }
}
