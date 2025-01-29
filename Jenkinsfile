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
                    withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKER_PASSWORD')]) {
                        // Depuración: Mostrar parte del token
                        bat 'echo DOCKER_PASSWORD=%DOCKER_PASSWORD:~0,5%****'

                        // Login usando usuario fijo y token
                        bat 'echo %DOCKER_PASSWORD% | docker login -u searinox7663 --password-stdin'
                    }

                    // Construir la imagen Docker
                    bat "docker build -t %DOCKER_IMAGE% ."

                    // Subir la imagen a Docker Hub
                    bat "docker push %DOCKER_IMAGE%"
                }
            }
        }

        // Otras etapas...
    }

    post {
        always {
            echo "Pipeline finalizado. Realizando limpieza si es necesario..."
        }
    }
}
