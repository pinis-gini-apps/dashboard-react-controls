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
console.log('------1---------')
console.log(packageJsonPath)
const getVersionFromPackageJson = branch => {
  try {
    execSync(`git checkout ${branch} -- ${packageJsonPath}`)
    const data = fs.readFileSync(packageJsonPath, 'utf8')
    console.log('------2---------')
    console.log(data)
    const packageJson = JSON.parse(data)
    return packageJson.version
  } catch (err) {
    console.error(`Error reading package.json from branch ${branch}:`, err)
    process.exit(1)
  }
}

const targetBranch = process.env.TARGET_BRANCH || 'development'
console.log('------3---------')

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
