pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        jdk 'JDK17'
    }

    environment {
        SONAR_TOKEN = credentials('SONAR_TOKEN')
        APP_NAME    = 'sit753-devops-app'
        APP_PORT    = '3000'
        VERSION     = "1.${BUILD_NUMBER}"
        DOCKER      = '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat "%DOCKER% build -t %APP_NAME%:%VERSION% -t %APP_NAME%:latest ."
                echo "Built image: %APP_NAME%:%VERSION%"
            }
        }

        stage('Test') {
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
                    -Dsonar.exclusions=**/node_modules/**,**/tests/** ^
                    -Dsonar.tests=tests ^
                    -Dsonar.host.url=https://sonarcloud.io ^
                    -Dsonar.token=%SONAR_TOKEN%
                    """

                }
            }
        }

        stage('Security Scan') {
            steps {
                bat 'npm audit --audit-level=high'
                bat 'npm audit --json > audit-report.json || echo Audit complete'
            }

            post {
                always {
                    archiveArtifacts artifacts: 'audit-report.json', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy to Staging') {
            steps {

                bat """
                %DOCKER% ps -a --format "{{.Names}}" | findstr %APP_NAME%
                if %ERRORLEVEL%==0 (
                    %DOCKER% stop %APP_NAME%
                    %DOCKER% rm %APP_NAME%
                )
                """

                bat """
                %DOCKER% run -d -p %APP_PORT%:3000 --name %APP_NAME% %APP_NAME%:latest
                """

                echo "Deployment successful"

            }
        }

        stage('Release') {
            steps {

                bat "%DOCKER% tag %APP_NAME%:latest %APP_NAME%:%VERSION%"

                echo "Released version: %VERSION%"

                bat "%DOCKER% images %APP_NAME%"
            }
        }

        stage('Monitoring') {
            steps {

                sleep(time: 5, unit: 'SECONDS')

                bat "curl -f http://localhost:%APP_PORT%/health"

                bat "curl -s http://localhost:%APP_PORT%/"

                echo "Health check passed — app is live at http://localhost:%APP_PORT%"
            }
        }

    }

    post {

        success {
            echo "Pipeline SUCCESS — Version %VERSION% is running."
        }

        failure {

            echo "Pipeline FAILED — stopping container if running."

            bat """
            %DOCKER% ps -a --format "{{.Names}}" | findstr %APP_NAME%
            if %ERRORLEVEL%==0 (
                %DOCKER% stop %APP_NAME%
            )
            """
        }
    }
}