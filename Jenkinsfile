pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
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
                bat '''
                npx sonar-scanner ^
                -Dsonar.projectKey=Wasleyaar_sit753-devops-pipeline ^
                -Dsonar.organization=wasleyaar ^
                -Dsonar.sources=. ^
                -Dsonar.host.url=https://sonarcloud.io ^
                -Dsonar.token=%SONAR_TOKEN%
                '''
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