pipeline {
    agent any

    environment {
        IMAGE_NAME = "advnagarajan/sample-app"
        EC2_HOST = "13.232.211.135"
    }

    stages {

        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Build Application') {
            steps {
                echo "Build step completed"
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t $IMAGE_NAME:${BUILD_NUMBER} .'
                sh 'docker tag $IMAGE_NAME:${BUILD_NUMBER} $IMAGE_NAME:latest'
            }
        }

        stage('Push Image to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $IMAGE_NAME:${BUILD_NUMBER}
                    docker push $IMAGE_NAME:latest
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
                    ssh -o StrictHostKeyChecking=no ec2-user@$EC2_HOST <<EOF
                    docker pull advnagarajan/sample-app:latest
                    docker stop sampleapp || true
                    docker rm sampleapp || true
                    docker run -d -p 80:8000 --name sampleapp advnagarajan/sample-app:latest
                    exit
                    EOF
                    '''
                }
            }
        }
    }
}