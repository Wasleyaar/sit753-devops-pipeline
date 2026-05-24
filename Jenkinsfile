pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        jdk 'JDK17'
    }

    environment {
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Code Quality') {
            steps {
                script {

                    def scannerHome = tool 'SonarScanner'

                    bat """
                    ${scannerHome}\\bin\\sonar-scanner.bat ^
                    -Dsonar.projectKey=Wasleyaar_sit753-devops-pipeline ^
                    -Dsonar.organization=wasleyaar ^
                    -Dsonar.sources=. ^
                    -Dsonar.host.url=https://sonarcloud.io ^
                    -Dsonar.token=%SONAR_TOKEN%
                    """

                }
            }
        }

        stage('Security Scan') {
            steps {
                bat 'npm audit --audit-level=high'
            }
        }

        stage('Build Application') {
            steps {
                bat 'echo Building application...'
            }
        }

    }

    post {

        success {
            echo 'Pipeline executed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }

    }
}