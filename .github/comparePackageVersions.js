const fs = require('fs')
const path = require('path')
const { exec, execSync } = require('child_process')

const command = 'pwd && ls -l'

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error}`)
    return
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`)
  }

  console.log(`stdout:\n${stdout}`)
})
const packageJsonPath = path.join(__dirname, 'package.json')
const getVersionFromPackageJson = branch => {
  try {
    execSync('git status')
    execSync(`git checkout ${branch} -- package.json`)
    const data = fs.readFileSync('package.json', 'utf8')
    console.log('------2---------')
    console.log(data)
    const packageJson = JSON.parse(data)
    return packageJson.version
  } catch (err) {
    console.error(`Error reading package.json from branch ${branch}:`, err)
    process.exit(1)
  }
}

console.log('------process.env.TARGET_BRANCH---------')
console.log(process.env.TARGET_BRANCH)

const targetBranch = 'development'
console.log('------targetBranch---------')
console.log(targetBranch)

const currentVersion = getVersionFromPackageJson('HEAD')

const targetVersion = getVersionFromPackageJson(targetBranch)

if (currentVersion !== targetVersion) {
  console.error(
    `Version mismatch: current branch (${currentVersion}), target branch (${targetVersion})`
  )
  process.exit(1)
} else {
  console.log(`Version is correct: ${currentVersion}`)
  process.exit(0)
}
