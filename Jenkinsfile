pipeline {
    agent any

    stages {
        stage('Environment Sanity Check') {
            steps {
                echo 'Checking Docker and Docker Compose versions to confirm node stability...'
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }

        stage('Install Code Dependencies') {
            steps {
                echo 'Installing Backend Dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
                
                echo 'Installing Frontend Dependencies...'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Automated API Validation') {
            steps {
                echo 'Spinning up application services using detached Docker Compose execution...'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Security Health Verification') {
            steps {
                echo 'Allowing services to boot...'
                sleep time: 10, unit: 'SECONDS'
                
                echo 'Sending health verification request to backend...'
                // The -f flag forces curl to fail with an exit code on HTTP errors (e.g. 500, 404)
                sh 'curl -sS -f http://localhost:5000/api/health || exit 1'
            }
        }
    }

    post {
        success {
            echo '==================================================='
            echo ' SUCCESS DEPLOYMENT VALIDATION MARKER '
            echo ' All stages passed! The TeleMedTech API is healthy. '
            echo '==================================================='
        }
        failure {
            echo '==================================================='
            echo ' PIPELINE FAILED '
            echo ' Tearing down containers to protect system memory... '
            echo '==================================================='
            sh 'docker-compose down'
        }
    }
}
