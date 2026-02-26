pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "advnagarajan/sample-frontend"
        BACKEND_IMAGE  = "advnagarajan/sample-backend"
        EC2_HOST = "13.232.211.135"
    }

    stages {

        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building frontend & backend images..."

                sh '''
                docker build -t $BACKEND_IMAGE:${BUILD_NUMBER} ./backend
                docker tag $BACKEND_IMAGE:${BUILD_NUMBER} $BACKEND_IMAGE:latest

                docker build -t $FRONTEND_IMAGE:${BUILD_NUMBER} ./frontend
                docker tag $FRONTEND_IMAGE:${BUILD_NUMBER} $FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                    docker push $BACKEND_IMAGE:${BUILD_NUMBER}
                    docker push $BACKEND_IMAGE:latest

                    docker push $FRONTEND_IMAGE:${BUILD_NUMBER}
                    docker push $FRONTEND_IMAGE:latest
                    '''
                }
            }
        }

        stage('Debug Branch') {
            steps {
                sh 'echo GIT_BRANCH=$GIT_BRANCH'
            }
        }

        stage('Deploy to EC2') {
            when {
                expression {
                    return env.GIT_BRANCH?.endsWith('/main')
                }
            }
            steps {
                sshagent(['ec2-key']) {
                    sh '''
        ssh -o StrictHostKeyChecking=no ec2-user@$EC2_HOST << 'EOF'

        echo "Pulling latest images..."
        docker pull advnagarajan/sample-backend:latest
        docker pull advnagarajan/sample-frontend:latest

        echo "Stopping old containers..."
        docker stop backend frontend sampleapp 2>/dev/null || true

        echo "Removing old containers..."
        docker rm backend frontend sampleapp 2>/dev/null || true

        echo "Starting backend on port 8000..."
        docker run -d \
        --name backend \
        -p 8000:8000 \
        advnagarajan/sample-backend:latest

        echo "Starting frontend on port 80..."
        docker run -d \
        --name frontend \
        -p 80:80 \
        advnagarajan/sample-frontend:latest

        echo "Deployment complete"

        EOF
        '''
                }
            }
        }
    }
}