pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'newsmern'
        DOCKER_REPO = 'saideep12345'
        MANIFEST_REPO = 'https://github.com/Saideep278/newsmern_manifest.git' // Git repo for manifests
        MANIFEST_BRANCH = 'main' // Change if using a different branch
        DEPLOY_FILE = 'manifests/deploy.yml' // Path to the manifest file
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    sh 'ls'
                }
            }
        }

        stage('Get Git Commit ID') {
            steps {
                script {
                    env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    echo "Using Git commit ID as tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker_cred', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh """
                            echo '${DOCKER_PASSWORD}' | docker login -u '${DOCKER_USERNAME}' --password-stdin
                        """
                    }
                }
            }
        }

        stage('Docker Build and Push') {
            steps {
                script {
                    sh """
                        set -ex
                        if [ ! -d client ]; then echo "Error: client directory not found"; exit 1; fi
                        cd client
                        ls
                        docker build --no-cache -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                        docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_REPO}/${DOCKER_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_REPO}/${DOCKER_IMAGE}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Update Kubernetes Manifest') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'git_token', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        sh """
                            set -ex
                            
                            # Remove existing repo if exists
                            rm -rf manifests_repo

                            # Clone the Git repo containing Kubernetes manifests using credentials
                            git clone -b ${MANIFEST_BRANCH} https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Saideep278/newsmern_manifest.git manifests_repo
                            cd manifests_repo

                            # Update image tag in deploy.yml
                            sed -i 's|image: ${DOCKER_REPO}/${DOCKER_IMAGE}:.*|image: ${DOCKER_REPO}/${DOCKER_IMAGE}:${IMAGE_TAG}|' ${DEPLOY_FILE}

                            # Commit and push changes
                            git config user.name "saideep278"
                            git config user.email "saideepchakilam278@gmail.com"
                            git add ${DEPLOY_FILE}
                            git commit -m "Update image tag to ${IMAGE_TAG}"
                            git push origin ${MANIFEST_BRANCH}
                        """
                    }
                }
            }
        }
    }
}
