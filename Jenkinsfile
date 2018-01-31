import hudson.Util;

// Reference:  https://qa.nuxeo.org/jenkins/pipeline-syntax/globals

node('CentOS-7') {

    String BRANCH = "${BRANCH}"
    String PROJECT="${PROJECT}"
    String REPOSITORY="${REPOSITORY}"
    String PRAUTHOR="${PRAUTHOR}"
    String PRURL="${PRURL}"
    String PRTITLE="${PRTITLE}"
    String PRID="${PRID}"

    ansiColor('xterm') {

        try {

            stage('announce') {
                env.NODEJS_HOME = "${tool 'node-production'}"
                env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"

                currentBuild.displayName = "#${BUILD_NUMBER}: ${BRANCH}"
                currentBuild.description = ""

                echo sh(script: 'env|sort', returnStdout: true)

                echo "PROJECT - ${PROJECT}, REPOSITORY - ${REPOSITORY}, PRAUTHOR - ${PRAUTHOR}, PRURL - ${PRURL}, PRTITLE - ${PRTITLE}, PRID - ${PRID}"

                step([$class: 'StashNotifier'])
            }

            /*
             * Delete previous runs, get the repo
             */
            stage('checkout') {

                deleteDir()
                checkout scm
            }

            stage('install') {

                APP_VERSION = sh (
                    script: 'npm run -s getversion',
                    returnStdout: true
                ).trim()

                echo "app version: ${APP_VERSION}"

                currentBuild.displayName = currentBuild.displayName + " - " + APP_VERSION

                //:: a possible place for refactoring based on things like BRANCH, VERSION, etc.

                sh 'echo ${APP_VERSION} > VERSION'

                //TODO:: need to figure out the environment and conditions that will need this
                // sh 'rm -rf node_modules'
                sh 'npm install'
                sh 'bower install'

            }

            stage('test') {

                env.NODE_ENV = "test"

                print "Environment will be : ${env.NODE_ENV}"

                sh 'grunt ci'

                publishHTML (target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: 'coverage',
                    reportFiles: 'index.html',
                    reportName: "Coverage Report"
                ])

            }

            stage('report status') {

                currentBuild.result = "SUCCESS"
                msg = notifyHipchat(currentBuild.result, "GREEN", false)
                // currentBuild.description = msg

                step([$class: 'StashNotifier'])
            }

        } catch (err) {

            println "Failed: ${err}"
            currentBuild.result = "FAILURE"
            msg = notifyHipchat(currentBuild.result, "RED", true, "${err}")
            currentBuild.description = msg
            step([$class: 'StashNotifier'])
            throw err
        }
    }
}



// ===========================================================================================================  Need these in a lib



//Module interface hipchat notifiation
def notifyHipchat(String status, String color, boolean notify = true, String extraMsg = '') {

    if (status == "FAILURE" || status == "SUCCESS") {
        message = "${JOB_NAME} #${BUILD_NUMBER}: origin/${BRANCH} (v${APP_VERSION}) Job ${status} after ${Util.getTimeSpanString(System.currentTimeMillis() - currentBuild.startTimeInMillis)} (<a href=\"${BUILD_URL}\">Open</a>) (<a href=\"${RUN_CHANGES_DISPLAY_URL}\">Changes</a>)"
        message += "\n\n${extraMsg}"
    } else {
        message = "${JOB_NAME} #${BUILD_NUMBER} Build ${status} (<b><a href=\"${BUILD_URL}\">Job</a></b>) (<a href=\"${RUN_CHANGES_DISPLAY_URL}\">Changes</a>)"
    }

    hipchat message, color, notify

    return message
}

//AUTHd hipchat notifiation
def hipchat(String msg, String color = 'YELLOW', boolean notify = true, String room = 'Rig Build Status', boolean failOnError = true, String server = 'hipchat.conops.timewarnercable.com', String sendAs = 'Jenkins') {
    group = ''
    if (notify) {
        msg = '@here ' + msg
    }
    hipchatSend color: color, credentialId: 'd5a60662-27a9-46a8-8a79-fb2a28828bd9', failOnError: true, message: msg, notify: false, room: room, sendAs: sendAs, server: server, v2enabled: true
}

def sendEmailNotification(String pr_author_email, String subject, String body) {
    //To send Email Notification to RequesterRecipientProvider (PR Owner)
    emailext body: body, subject: subject, to: pr_author_email
}
